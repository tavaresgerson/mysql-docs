#### 8.7.5.1 Configurando o Contexto de Porta TCP para o mysqld

A porta TCP padrão para o **mysqld** é `3306`; e o tipo de contexto SELinux usado é `mysqld_port_t`.

Se você configurar o **mysqld** para usar uma porta TCP diferente, você pode precisar definir o contexto para a nova porta. Por exemplo, para definir o contexto SELinux para uma porta não padrão, como a porta 3307:

```
semanage port -a -t mysqld_port_t -p tcp 3307
```

Para confirmar que a porta foi adicionada:

```
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      3307, 1186, 3306, 63132-63164
```