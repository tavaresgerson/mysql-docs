### 6.7.3 Políticas SELinux do MySQL Server

Os módulos de Policy SELinux do MySQL Server são tipicamente instalados por padrão. Você pode visualizar os módulos instalados usando o comando **semodule -l**. Os módulos de Policy SELinux do MySQL Server incluem:

* `mysqld_selinux`
* `mysqld_safe_selinux`

Para obter informações sobre os módulos de Policy SELinux do MySQL Server, consulte as *manual pages* (páginas de manual) do SELinux. As *manual pages* fornecem informações sobre *types* e *Booleans* associados ao service MySQL. As *manual pages* são nomeadas no formato `service-name_selinux`.

```sql
man mysqld_selinux
```

Se as *manual pages* do SELinux não estiverem disponíveis, consulte a documentação SELinux da sua *distribution* para obter informações sobre como gerar *manual pages* usando a utility `sepolicy manpage`.