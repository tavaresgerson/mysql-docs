#### 8.12.4.3 Habilitando o Suporte a Large Pages

Algumas arquiteturas de hardware e sistema operacional suportam páginas de memória maiores do que o padrão (geralmente 4KB). A implementação real desse suporte depende do hardware e sistema operacional subjacentes. Aplicações que realizam muitos acessos à memória podem obter melhorias de performance ao usar *large pages* devido à redução de *Translation Lookaside Buffer* (TLB) misses.

No MySQL, *large pages* podem ser usadas pelo `InnoDB` para alocar memória para seu *buffer pool* e *additional memory pool*.

O uso padrão de *large pages* no MySQL tenta utilizar o maior tamanho suportado, até 4MB. Sob o Solaris, um recurso de “super large pages” permite o uso de páginas de até 256MB. Este recurso está disponível para plataformas SPARC recentes. Ele pode ser habilitado ou desabilitado usando as opções `--super-large-pages` ou `--skip-super-large-pages`.

O MySQL também suporta a implementação Linux de suporte a *large pages* (que é chamada de HugeTLB no Linux).

Antes que *large pages* possam ser usadas no Linux, o kernel deve ser habilitado para suportá-las e é necessário configurar o *memory pool* HugeTLB. Para referência, a API HugeTBL está documentada no arquivo `Documentation/vm/hugetlbpage.txt` das suas fontes do Linux.

Os kernels de alguns sistemas recentes, como o Red Hat Enterprise Linux, podem ter o recurso *large pages* habilitado por padrão. Para verificar se isso é verdade para o seu kernel, use o seguinte comando e procure por linhas de saída contendo “huge”:

```sql
$> grep -i huge /proc/meminfo
AnonHugePages:   2658304 kB
ShmemHugePages:        0 kB
HugePages_Total:       0
HugePages_Free:        0
HugePages_Rsvd:        0
HugePages_Surp:        0
Hugepagesize:       2048 kB
Hugetlb:               0 kB
```

A saída do comando não vazia indica que o suporte a *large pages* está presente, mas os valores zero indicam que nenhuma página está configurada para uso.

Se o seu kernel precisar ser reconfigurado para suportar *large pages*, consulte o arquivo `hugetlbpage.txt` para obter instruções.

Assumindo que o suporte a *large pages* esteja habilitado no seu kernel Linux, configure-o para uso pelo MySQL seguindo os seguintes passos:

1. Determine o número de *large pages* necessárias. Este é o tamanho do *InnoDB buffer pool* dividido pelo tamanho da *large page*, que podemos calcular como `innodb_buffer_pool_size` / `Hugepagesize`. Assumindo o valor padrão para o `innodb_buffer_pool_size` (128MB) e usando o valor `Hugepagesize` obtido de `/proc/meminfo` (2MB), o resultado é 128MB / 2MB, ou 64 Huge Pages. Chamamos este valor de *`P`*.

2. Como *system root*, abra o arquivo `/etc/sysctl.conf` em um editor de texto e adicione a linha mostrada aqui, onde *`P`* é o número de *large pages* obtido na etapa anterior:

   ```sql
   vm.nr_hugepages=P
   ```

   Usando o valor real obtido anteriormente, a linha adicional deve ser parecida com esta:

   ```sql
   vm.nr_hugepages=66
   ```

   Salve o arquivo atualizado.

3. Como *system root*, execute o seguinte comando:

   ```sql
   $> sudo sysctl -p
   ```

   Nota

   Em alguns sistemas, o arquivo de *large pages* pode ter um nome ligeiramente diferente; por exemplo, algumas distribuições o chamam de `nr_hugepages`. Caso o **sysctl** retorne um erro relacionado ao nome do arquivo, verifique o nome do arquivo correspondente em `/proc/sys/vm` e use-o em seu lugar.

   Para verificar a configuração de *large pages*, verifique `/proc/meminfo` novamente conforme descrito anteriormente. Agora você deve ver alguns valores não zero adicionais na saída, semelhante a isto:

   ```sql
   $> grep -i huge /proc/meminfo
   AnonHugePages:   2686976 kB
   ShmemHugePages:        0 kB
   HugePages_Total:     233
   HugePages_Free:      233
   HugePages_Rsvd:        0
   HugePages_Surp:        0
   Hugepagesize:       2048 kB
   Hugetlb:          477184 kB
   ```

4. Opcionalmente, você pode querer compactar o VM do Linux. Você pode fazer isso usando uma sequência de comandos, possivelmente em um arquivo *script*, semelhante ao que é mostrado aqui:

   ```sql
   sync
   sync
   sync
   echo 3 > /proc/sys/vm/drop_caches
   echo 1 > /proc/sys/vm/compact_memory
   ```

   Consulte a documentação da sua plataforma operacional para obter mais informações sobre como fazer isso.

5. Verifique quaisquer arquivos de configuração, como `my.cnf`, usados pelo servidor e certifique-se de que `innodb_buffer_pool_chunk_size` esteja configurado para ser maior do que o tamanho da *huge page*. O valor padrão para esta variável é 128M.

6. O suporte a *large pages* no servidor MySQL é desabilitado por padrão. Para habilitá-lo, inicie o servidor com `--large-pages`. Você também pode fazer isso adicionando a seguinte linha à seção `[mysqld]` do arquivo `my.cnf` do servidor:

   ```sql
   large-pages=ON
   ```

   Com esta opção habilitada, o `InnoDB` usa *large pages* automaticamente para seu *buffer pool* e *additional memory pool*. Se o `InnoDB` não puder fazer isso, ele recorre ao uso de memória tradicional e escreve um aviso no *error log*: Warning: Using conventional memory pool.

Você pode verificar se o MySQL está usando *large pages* verificando `/proc/meminfo` novamente após reiniciar o **mysqld**, assim:

```sql
$> grep -i huge /proc/meminfo
AnonHugePages:   2516992 kB
ShmemHugePages:        0 kB
HugePages_Total:     233
HugePages_Free:      222
HugePages_Rsvd:       55
HugePages_Surp:        0
Hugepagesize:       2048 kB
Hugetlb:          477184 kB
```