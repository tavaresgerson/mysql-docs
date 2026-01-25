### 13.1.4 Instrução ALTER INSTANCE

```sql
ALTER INSTANCE ROTATE INNODB MASTER KEY
```

A instrução `ALTER INSTANCE`, introduzida no MySQL 5.7.11, define ações aplicáveis a uma instância de server MySQL. A instrução suporta estas ações:

* `ALTER INSTANCE ROTATE INNODB MASTER KEY`

  Esta ação rotaciona a master encryption key utilizada para a criptografia de tablespace do `InnoDB`. A rotação da Key requer o privilégio [`SUPER`](privileges-provided.html#priv_super). Para executar esta ação, um plugin de keyring deve estar instalado e configurado. Para instruções, consulte [Seção 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 O Keyring do MySQL").

  A instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta DML concorrente. No entanto, ela não pode ser executada concorrentemente com operações [`CREATE TABLE ... ENCRYPTION`](create-table.html "13.1.18 Instrução CREATE TABLE") ou [`ALTER TABLE ... ENCRYPTION`](alter-table.html "13.1.8 Instrução ALTER TABLE"), e Locks são aplicados para prevenir conflitos que poderiam surgir da execução concorrente dessas instruções. Se uma das instruções conflitantes estiver em execução, ela deve ser concluída antes que outra possa prosseguir.

  As ações do `ALTER INSTANCE` são escritas no binary log para que possam ser executadas em servers replicados.

  Para informações adicionais sobre o uso da instrução `ALTER INSTANCE ROTATE INNODB MASTER KEY`, consulte [Seção 14.14, “InnoDB Data-at-Rest Encryption”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption"). Para informações sobre plugins de keyring, consulte [Seção 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 O Keyring do MySQL").