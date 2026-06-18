### 6.7.5 Contexto de Porta TCP SELinux

As instruções a seguir utilizam o binário `semanage` para gerenciar o contexto da porta; no RHEL, ele faz parte do pacote `policycoreutils-python-utils`:

```sh
yum install -y policycoreutils-python-utils
```

Após instalar o binário `semanage`, você pode listar portas definidas com o contexto `mysqld_port_t` usando `semanage` com a opção `port`.

```sh
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      1186, 3306, 63132-63164
```
