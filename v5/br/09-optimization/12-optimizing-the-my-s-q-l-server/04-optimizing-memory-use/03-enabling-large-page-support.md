#### 8.12.4.3 Habilitar o suporte para páginas grandes

Algumas arquiteturas de hardware e sistemas operacionais suportam páginas de memória maiores que o padrão (geralmente 4 KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacentes. Aplicações que realizam muitos acessos à memória podem obter melhorias de desempenho ao usar páginas grandes devido à redução de erros no Buffer de Busca de Tradução (TLB).

No MySQL, as páginas grandes podem ser usadas pelo `InnoDB` para alocar memória para seu pool de buffers e um pool de memória adicional.

O uso padrão de páginas grandes no MySQL tenta usar o tamanho maior suportado, até 4 MB. Sob o Solaris, um recurso de "páginas super grandes" permite o uso de páginas de até 256 MB. Esse recurso está disponível para plataformas SPARC recentes. Ele pode ser ativado ou desativado usando a opção `--super-large-pages` ou `--skip-super-large-pages`.

O MySQL também suporta a implementação do Linux para suporte a páginas grandes (que é chamada de HugeTLB no Linux).

Antes que páginas grandes possam ser usadas no Linux, o kernel deve ser habilitado para suportá-las e é necessário configurar o pool de memória HugeTLB. Para referência, a API HugeTBL está documentada no arquivo `Documentation/vm/hugetlbpage.txt` dos seus repositórios do Linux.

Os kernels de alguns sistemas recentes, como o Red Hat Enterprise Linux, podem ter a funcionalidade de páginas grandes habilitada por padrão. Para verificar se isso é verdade para o seu kernel, use o seguinte comando e procure por linhas de saída que contenham “huge”:

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

A saída de comando não vazia indica que o suporte para páginas grandes está presente, mas os valores zero indicam que nenhuma página está configurada para uso.

Se o seu kernel precisar ser reconfigurado para suportar páginas grandes, consulte o arquivo `hugetlbpage.txt` para obter instruções.

Supondo que o seu kernel Linux tenha o suporte de páginas grandes habilitado, configure-o para uso pelo MySQL seguindo os passos abaixo:

1. Determine o número de páginas grandes necessárias. Esse é o tamanho do pool de buffers do InnoDB dividido pelo tamanho da página grande, que podemos calcular como `innodb_buffer_pool_size` / `Hugepagesize`. Supondo o valor padrão para o `innodb_buffer_pool_size` (128MB) e usando o valor de `Hugepagesize` obtido do `/proc/meminfo` (2MB), isso é 128MB / 2MB, ou 64 Páginas Grandes. Chamamos esse valor de *`P`*.

2. Como root do sistema, abra o arquivo `/etc/sysctl.conf` em um editor de texto e adicione a linha mostrada aqui, onde *`P`* é o número de páginas grandes obtidas no passo anterior:

   ```sql
   vm.nr_hugepages=P
   ```

   Usando o valor real obtido anteriormente, a linha adicional deve parecer assim:

   ```sql
   vm.nr_hugepages=66
   ```

   Salve o arquivo atualizado.

3. Como raiz do sistema, execute o seguinte comando:

   ```sql
   $> sudo sysctl -p
   ```

   Nota

   Em alguns sistemas, o arquivo de páginas grandes pode ter um nome ligeiramente diferente; por exemplo, algumas distribuições chamam-no de `nr_hugepages`. No caso de o **sysctl** retornar um erro relacionado ao nome do arquivo, verifique o nome do arquivo correspondente em `/proc/sys/vm` e use-o em vez disso.

   Para verificar a configuração da página grande, verifique novamente o `/proc/meminfo`, conforme descrito anteriormente. Agora você deve ver alguns valores adicionais não nulos na saída, semelhantes a este:

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

4. Opcionalmente, você pode querer compactar a VM Linux. Você pode fazer isso usando uma sequência de comandos, possivelmente em um arquivo de script, semelhante ao que é mostrado aqui:

   ```sql
   sync
   sync
   sync
   echo 3 > /proc/sys/vm/drop_caches
   echo 1 > /proc/sys/vm/compact_memory
   ```

   Consulte a documentação da sua plataforma operacional para obter mais informações sobre como fazer isso.

5. Verifique quaisquer arquivos de configuração, como `my.cnf`, usados pelo servidor, e certifique-se de que `innodb_buffer_pool_chunk_size` esteja configurado para um tamanho maior que o tamanho da página enorme. O valor padrão para essa variável é 128M.

6. O suporte a páginas grandes no servidor MySQL é desativado por padrão. Para ativá-lo, inicie o servidor com `--large-pages`. Você também pode fazer isso adicionando a seguinte linha à seção `[mysqld]` do arquivo `my.cnf` do servidor:

   ```sql
   large-pages=ON
   ```

   Com essa opção habilitada, o `InnoDB` usa páginas grandes automaticamente para seu pool de buffer e pool de memória adicional. Se o `InnoDB` não conseguir fazer isso, ele recorre ao uso de memória tradicional e escreve uma mensagem de aviso no log de erros: Aviso: Usando pool de memória convencional.

Você pode verificar se o MySQL está usando páginas grandes verificando novamente o `/proc/meminfo` após reiniciar o **mysqld**, da seguinte forma:

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
