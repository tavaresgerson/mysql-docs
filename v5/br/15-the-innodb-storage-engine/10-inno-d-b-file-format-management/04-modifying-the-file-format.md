### 14.10.4 Modificar o formato do arquivo

Cada arquivo de espaço de tabela InnoDB (com um nome que corresponda a `*.ibd`) é marcado com o formato de arquivo usado para criar sua tabela e índices. A maneira de modificar o formato de arquivo é recriar a tabela e seus índices. A maneira mais fácil de recriar uma tabela e seus índices é usar o seguinte comando em cada tabela que você deseja modificar:

```sql
ALTER TABLE t ROW_FORMAT=format_name;
```

Se você estiver modificando o formato do arquivo para uma versão mais antiga do MySQL, pode haver incompatibilidades nos formatos de armazenamento de tabelas que exigem etapas adicionais. Para obter informações sobre a desinstalação para uma versão anterior do MySQL, consulte a Seção 2.11, “Desinstalação do MySQL”.
