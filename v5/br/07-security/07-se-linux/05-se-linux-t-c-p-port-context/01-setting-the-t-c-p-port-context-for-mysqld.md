#### 6.7.5.1 Configurando o contexto da porta TCP para o mysqld

A porta TCP padrão para **mysqld** é `3306`; e o tipo de contexto SELinux usado é `mysqld_port_t`.

Se você configurar o **mysqld** para usar uma porta TCP diferente (`[**port**]` - server-system-variables.html#sysvar_port), você pode precisar definir o contexto para a nova porta. Por exemplo, para definir o contexto SELinux para uma porta não padrão, como a porta 3307:

```sql
semanage port -a -t mysqld_port_t -p tcp 3307
```

Para confirmar que o porto foi adicionado:

```sql
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      3307, 1186, 3306, 63132-63164
```
