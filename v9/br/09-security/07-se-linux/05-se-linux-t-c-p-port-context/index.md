### 8.7.5 Contexto de Porta TCP SELinux

8.7.5.1 Configurando o Contexto de Porta TCP para mysqld

8.7.5.2 Configurando o Contexto de Porta TCP para Recursos do MySQL

As instruções a seguir utilizam o binário `semanage` para gerenciar o contexto de porta; no RHEL, ele faz parte do pacote `policycoreutils-python-utils`:

```
yum install -y policycoreutils-python-utils
```

Após instalar o binário `semanage`, você pode listar as portas definidas com o contexto `mysqld_port_t` usando `semanage` com a opção `port`.

```
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      1186, 3306, 63132-63164
```