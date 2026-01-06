### 13.1.4 Declaração ALTER INSTANCE

```sql
ALTER INSTANCE ROTATE INNODB MASTER KEY
```

`ALTER INSTANCE`, introduzido no MySQL 5.7.11, define ações aplicáveis a uma instância do servidor MySQL. A instrução suporta essas ações:

- `ALTER INSTANCE ROTATE INNODB MASTER KEY`

  Essa ação rotação da chave de criptografia mestre usada para o espaço de tabela `InnoDB` exige o privilégio `SUPER`. Para realizar essa ação, um plugin de chave deve ser instalado e configurado. Para obter instruções, consulte Seção 6.4.4, “O Keyring do MySQL”.

  `ALTER INSTANCE ROTATE INNODB MASTER KEY` suporta DML concorrente. No entanto, não pode ser executado concorrentemente com as operações `CREATE TABLE ... ENCRYPTION` (create-table.html) ou `ALTER TABLE ... ENCRYPTION` (alter-table.html), e são tomadas bloqueadas para evitar conflitos que possam surgir da execução concorrente dessas instruções. Se uma das instruções conflitantes estiver em execução, ela deve ser concluída antes que outra possa prosseguir.

  As ações `ALTER INSTANCE` são escritas no log binário para que possam ser executadas em servidores replicados.

  Para obter informações adicionais sobre o uso do comando `ALTER INSTANCE ROTATE INNODB MASTER KEY`, consulte Seção 14.14, “Criptografia de dados em repouso do InnoDB”. Para informações sobre plugins de chave, consulte Seção 6.4.4, “O Keyring do MySQL”.
