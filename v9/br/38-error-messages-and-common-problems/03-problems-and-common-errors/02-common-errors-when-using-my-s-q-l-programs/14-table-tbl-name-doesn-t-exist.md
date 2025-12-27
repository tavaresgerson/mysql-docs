#### B.3.2.14 A tabela 'tbl\_name' não existe

Se você receber um dos seguintes erros, geralmente significa que não existe nenhuma tabela no banco de dados padrão com o nome fornecido:

```
Table 'tbl_name' doesn't exist
Can't find file: 'tbl_name' (errno: 2)
```

Em alguns casos, pode ser que a tabela exista, mas você esteja se referindo a ela incorretamente:

* Como o MySQL usa diretórios e arquivos para armazenar bancos de dados e tabelas, os nomes de banco de dados e tabelas são sensíveis ao maiúsculas e minúsculas se estiverem localizados em um sistema de arquivos que tem nomes de arquivos sensíveis ao maiúsculas e minúsculas.

* Mesmo para sistemas de arquivos que não são sensíveis ao maiúsculas e minúsculas, como no Windows, todas as referências a uma determinada tabela dentro de uma consulta devem usar a mesma letra maiúscula.

Você pode verificar quais tabelas estão no banco de dados padrão com `SHOW TABLES`. Veja a Seção 15.7.7, “Instruções SHOW”.