### 8.7.5 Contexto de Porta TCP SELinux

8.7.5.1 Configurando o contexto da porta TCP para o mysqld

8.7.5.2 Configurando o contexto da porta TCP para recursos do MySQL

As instruções que se seguem utilizam o código binário `semanage` para gerenciar o contexto da porta; no RHEL, faz parte do pacote `policycoreutils-python-utils`:

```
yum install -y policycoreutils-python-utils
```

Após instalar o binário `semanage`, você pode listar os ports definidos com o contexto `mysqld_port_t` usando `semanage` com a opção `port`.

```
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      1186, 3306, 63132-63164
```
