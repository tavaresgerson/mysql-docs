### 6.7.5 Contexto de Porta TCP SELinux

[6.7.5.1 Definindo o Contexto de Porta TCP para o mysqld](selinux-context-mysqld-tcp-port.html)

[6.7.5.2 Definindo o Contexto de Porta TCP para Recursos do MySQL](selinux-context-mysql-feature-ports.html)

As instruções a seguir usam o `binary` `semanage` para gerenciar o `port context`; no RHEL, ele faz parte do `package` `policycoreutils-python-utils`:

```sql
yum install -y policycoreutils-python-utils
```

Após instalar o `binary` `semanage`, você pode listar os `ports` definidos com o `context` `mysqld_port_t` usando o `semanage` com a opção `port`.

```sql
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      1186, 3306, 63132-63164
```