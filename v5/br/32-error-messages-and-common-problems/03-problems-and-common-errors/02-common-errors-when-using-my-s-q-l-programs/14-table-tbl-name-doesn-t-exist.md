#### B.3.2.14 Tabela 'tbl_name' não existe

Se você receber um dos seguintes erros, isso geralmente significa que não existe nenhuma `Table` no `Database` padrão com o nome fornecido:

```sql
Table 'tbl_name' doesn't exist
Can't find file: 'tbl_name' (errno: 2)
```

Em alguns casos, a `Table` pode realmente existir, mas você está se referindo a ela incorretamente:

* Como o MySQL utiliza diretórios e arquivos para armazenar `Databases` e `Tables`, os nomes de `Database` e `Table` são sensíveis a maiúsculas e minúsculas se estiverem localizados em um sistema de arquivos que possui nomes de arquivo sensíveis a maiúsculas e minúsculas.

* Mesmo para sistemas de arquivos que não são sensíveis a maiúsculas e minúsculas, como no Windows, todas as referências a uma determinada `Table` dentro de uma `Query` devem usar a mesma capitalização.

Você pode verificar quais `Tables` estão no `Database` padrão com [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement"). Consulte [Seção 13.7.5, “SHOW Statements”](show.html "13.7.5 SHOW Statements").