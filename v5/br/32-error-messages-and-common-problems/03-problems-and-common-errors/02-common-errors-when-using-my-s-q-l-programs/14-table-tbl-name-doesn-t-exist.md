#### B.3.2.14 A tabela 'tbl\_name' não existe

Se você receber um dos seguintes erros, geralmente significa que não existe nenhuma tabela no banco de dados padrão com o nome fornecido:

```sql
Table 'tbl_name' doesn't exist
Can't find file: 'tbl_name' (errno: 2)
```

Em alguns casos, pode ser que a tabela exista, mas que você esteja se referindo a ela incorretamente:

- Como o MySQL usa diretórios e arquivos para armazenar bancos de dados e tabelas, os nomes de banco de dados e tabelas são sensíveis ao maiúsculas e minúsculas se estiverem localizados em um sistema de arquivos que tenha nomes de arquivos sensíveis ao maiúsculas e minúsculas.

- Mesmo para sistemas de arquivos que não são case-sensitive, como no Windows, todas as referências a uma determinada tabela em uma consulta devem usar a mesma letra maiúscula.

Você pode verificar quais tabelas estão no banco de dados padrão com [`SHOW TABLES`](show-tables.html). Veja [Seção 13.7.5, “Instruções SHOW”](show.html).
