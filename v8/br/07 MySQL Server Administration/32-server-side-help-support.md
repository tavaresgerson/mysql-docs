### 7.1.17 Suporte de Ajuda do Servidor

O MySQL Server suporta uma instrução `HELP` que retorna informações do Manual de Referência MySQL (ver Seção 15.8.3, HELP Statement). Esta informação é armazenada em várias tabelas no `mysql` esquema (ver Seção 7.3, The mysql System Schema). O funcionamento correto da instrução `HELP` requer que essas tabelas de ajuda sejam inicializadas.

Para uma nova instalação do MySQL usando uma distribuição binária ou de origem no Unix, a inicialização de conteúdo da tabela de ajuda ocorre quando você inicializa o diretório de dados (veja Seção 2.9.1, "Initializando o diretório de dados").

Para uma atualização do MySQL usando uma distribuição binária, o conteúdo da tabela de ajuda é atualizado automaticamente pelo servidor. Para atualizá-lo manualmente, localize o arquivo `fill_help_tables.sql` no diretório `share` ou `share/mysql`. Mude de localização para esse diretório e processe o arquivo com o cliente `mysql` da seguinte forma:

```
mysql -u root -p mysql < fill_help_tables.sql
```

O comando mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tem privilégios para modificar tabelas no `mysql` esquema. Ajuste os parâmetros de conexão conforme necessário.
