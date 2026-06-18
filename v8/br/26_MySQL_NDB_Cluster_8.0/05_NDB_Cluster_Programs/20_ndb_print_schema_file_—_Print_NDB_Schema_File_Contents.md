### 25.5.20 ndb\_print\_schema\_file — Imprimir o conteúdo do arquivo de esquema do NDB

O **ndb\_print\_schema\_file** obtém informações de diagnóstico de um arquivo de esquema de cluster.

#### Uso

```
ndb_print_schema_file file_name
```

`file_name` é o nome de um arquivo de esquema de cluster. Para obter mais informações sobre arquivos de esquema de cluster, consulte o diretório do sistema de arquivos de nó de dados do NDB Cluster.

Assim como **ndb\_print\_backup\_file** e **ndb\_print\_sys\_file** (e ao contrário da maioria das outras ferramentas `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb\_print\_schema\_file** deve ser executado em um nó de dados de cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.

#### Opções adicionais

None.
