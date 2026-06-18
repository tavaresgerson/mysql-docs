### 25.5.21 ndb\_print\_sys\_file — Imprimir o conteúdo do arquivo do sistema NDB

O **ndb\_print\_sys\_file** obtém informações de diagnóstico de um arquivo de sistema do NDB Cluster.

#### Uso

```
ndb_print_sys_file file_name
```

`file_name` é o nome de um arquivo de sistema de cluster (sysfile). Arquivos de sistema de cluster estão localizados no diretório de dados de um nó de dados (`DataDir`); o caminho sob este diretório para arquivos de sistema corresponde ao padrão `ndb_#_fs/D#/DBDIH/P#.sysfile`. Em cada caso, o `#` representa um número (não necessariamente o mesmo número). Para mais informações, consulte o diretório do sistema de arquivos de nó de dados do NDB Cluster.

Assim como **ndb\_print\_backup\_file** e **ndb\_print\_schema\_file** (e ao contrário da maioria das outras ferramentas `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb\_print\_backup\_file** deve ser executado em um nó de dados de cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções adicionais

None.
