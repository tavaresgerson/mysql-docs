#### 10.12.3.3 Habilitando Suporte a Páginas Grandes

Alguns arquiteturas de hardware e sistemas operacionais suportam páginas de memória maiores que o padrão (geralmente 4KB). A implementação real deste suporte depende do hardware e do sistema operacional subjacente. Aplicações que realizam muitos acessos à memória podem obter melhorias de desempenho ao usar páginas grandes devido à redução de erros no Buffer de Busca de Tradução (TLB).

No MySQL, as páginas grandes podem ser usadas pelo `InnoDB` para alocar memória para seu pool de buffers e um pool de memória adicional.

O uso padrão de páginas grandes no MySQL tenta usar o maior tamanho suportado, até 4MB. Sob o Solaris, uma funcionalidade de “páginas super grandes” permite o uso de páginas de até 256MB. Esta funcionalidade está disponível para plataformas SPARC recentes. Pode ser habilitada ou desabilitada usando a opção `--super-large-pages` ou `--skip-super-large-pages`.

O MySQL também suporta a implementação do Linux de suporte a páginas grandes (que é chamada de HugeTLB no Linux).

Antes que as páginas grandes possam ser usadas no Linux, o kernel deve ser habilitado para suportar elas e é necessário configurar o pool de memória HugeTLB. Para referência, a API HugeTBL está documentada no arquivo `Documentation/vm/hugetlbpage.txt` dos seus fontes do Linux.

Os kernels de alguns sistemas recentes, como o Red Hat Enterprise Linux, podem ter a funcionalidade de páginas grandes habilitada por padrão. Para verificar se isso é verdade para o seu kernel, use o seguinte comando e procure por linhas de saída contendo “huge”:

```
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

A saída do comando não vazia indica que o suporte a páginas grandes está presente, mas os valores zerados indicam que nenhuma página está configurada para uso.

Se o seu kernel precisar ser reconfigurado para suportar páginas grandes, consulte o arquivo `hugetlbpage.txt` para instruções.

Supondo que o seu kernel do Linux tenha suporte a páginas grandes habilitado, configure-o para uso pelo MySQL usando os seguintes passos:

1. Determine o número de páginas grandes necessárias. Esse é o tamanho do pool de buffers do InnoDB dividido pelo tamanho da página grande, que podemos calcular como `innodb_buffer_pool_size` / `Hugepagesize`. Supondo o valor padrão para o `innodb_buffer_pool_size` (128MB) e usando o valor de `Hugepagesize` obtido a partir de `/proc/meminfo` (2MB), isso é 128MB / 2MB, ou 64 Páginas Grandes. Chamamos esse valor de *`P`*.
2. Como raiz do sistema, abra o arquivo `/etc/sysctl.conf` em um editor de texto e adicione a linha mostrada aqui, onde *`P`* é o número de páginas grandes obtido no passo anterior:

   ```
   vm.nr_hugepages=P
   ```

   Usando o valor real obtido anteriormente, a linha adicional deve parecer assim:

   ```
   vm.nr_hugepages=66
   ```

   Salve o arquivo atualizado.
3. Como raiz do sistema, execute o seguinte comando:

   ```
   $> sudo sysctl -p
   ```

   ::: info Nota

   Em alguns sistemas, o arquivo de páginas grandes pode ter um nome ligeiramente diferente; por exemplo, algumas distribuições chamam-no de `nr_hugepages`. No caso de o **sysctl** retornar um erro relacionado ao nome do arquivo, verifique o nome do arquivo correspondente em `/proc/sys/vm` e use esse nome.


   :::

   Para verificar a configuração da página grande, verifique novamente o `/proc/meminfo` como descrito anteriormente. Agora, você deve ver alguns valores adicionais não nulos na saída, semelhantes a este:

   ```
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
4. Opcionalmente, você pode querer compactar a VM do Linux. Você pode fazer isso usando uma sequência de comandos, possivelmente em um arquivo de script, semelhante ao que é mostrado aqui:

   ```
   sync
   sync
   sync
   echo 3 > /proc/sys/vm/drop_caches
   echo 1 > /proc/sys/vm/compact_memory
   ```

   Consulte a documentação da sua plataforma operacional para obter mais informações sobre como fazer isso.
5. Verifique quaisquer arquivos de configuração, como `my.cnf` usado pelo servidor, e certifique-se de que `innodb_buffer_pool_chunk_size` esteja configurado maior que o tamanho da página grande. O valor padrão para essa variável é 128M.
6. O suporte a páginas grandes no servidor MySQL está desativado por padrão. Para ativá-lo, inicie o servidor com `--large-pages`. Você também pode fazer isso adicionando a seguinte linha à seção `[mysqld]` do arquivo `my.cnf` do servidor:

Com essa opção habilitada, o `InnoDB` usa páginas grandes automaticamente para seu pool de buffer e pool de memória adicional. Se o `InnoDB` não conseguir fazer isso, ele recorre ao uso de memória tradicional e escreve uma mensagem de aviso no log de erros: Aviso: Usando pool de memória convencional.

Você pode verificar se o MySQL está usando agora páginas grandes verificando `/proc/meminfo` novamente após reiniciar o `mysqld`, da seguinte forma:

```
   large-pages=ON
   ```