### 7.1.17 Suporte ao Ajuda no Lado do Servidor

O MySQL Server suporta uma instrução `HELP` que retorna informações do Manual de Referência do MySQL (consulte a Seção 15.8.3, “Instrução HELP”). Essas informações são armazenadas em várias tabelas no esquema `mysql` (consulte a Seção 7.3, “O Esquema do Sistema mysql”). O funcionamento adequado da instrução `HELP` requer que essas tabelas de ajuda sejam inicializadas.

Para uma nova instalação do MySQL usando uma distribuição binária ou de código-fonte no Unix, a inicialização do conteúdo das tabelas de ajuda ocorre quando você inicializa o diretório de dados (consulte a Seção 2.9.1, “Inicializando o Diretório de Dados”). Para uma distribuição RPM no Linux ou distribuição binária no Windows, a inicialização do conteúdo ocorre como parte do processo de instalação do MySQL.

Para uma atualização do MySQL usando uma distribuição binária, o conteúdo das tabelas de ajuda é atualizado automaticamente pelo servidor. Para atualizá-lo manualmente, localize o arquivo `fill_help_tables.sql` no diretório `share` ou `share/mysql`. Altere a localização para esse diretório e processe o arquivo com o cliente `mysql` da seguinte forma:

```
mysql -u root -p mysql < fill_help_tables.sql
```

O comando mostrado aqui assume que você se conecta ao servidor usando uma conta como `root` que tenha privilégios para modificar tabelas no esquema `mysql`. Ajuste os parâmetros de conexão conforme necessário.