### 14.10.4 Modificando o Formato do Arquivo

Cada arquivo de `tablespace` InnoDB (com um nome que corresponde a `*.ibd`) é marcado com o formato do arquivo usado para criar sua `table` e `indexes`. A forma de modificar o formato do arquivo é recriar a `table` e seus `indexes`. A maneira mais fácil de recriar uma `table` e seus `indexes` é usar o seguinte comando em cada `table` que você deseja modificar:

```sql
ALTER TABLE t ROW_FORMAT=format_name;
```

Se você estiver modificando o formato do arquivo para fazer um `downgrade` para uma versão mais antiga do MySQL, pode haver incompatibilidades nos formatos de armazenamento da `table` que exigem etapas adicionais. Para obter informações sobre como fazer o `downgrade` para uma versão anterior do MySQL, consulte a Seção 2.11, “Downgrading MySQL”.