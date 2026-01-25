#### 6.7.5.1 Configurando o Contexto da TCP Port para o mysqld

A TCP Port padrão para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") é `3306`; e o tipo de contexto SELinux usado é `mysqld_port_t`.

Se você configurar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") para usar uma [`port`](server-system-variables.html#sysvar_port) TCP diferente, pode ser necessário definir o contexto para a nova port. Por exemplo, para definir o contexto SELinux para uma port não-padrão, como a port 3307:

```sql
semanage port -a -t mysqld_port_t -p tcp 3307
```

Para confirmar que a port foi adicionada:

```sql
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      3307, 1186, 3306, 63132-63164
```