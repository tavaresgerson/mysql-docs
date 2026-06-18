### 6.7.2 Mudando o modo SELinux

O SELinux suporta os modos de aplicação, permissivo e desativado. O modo de aplicação é o padrão. O modo permissivo permite operações que não são permitidas no modo de aplicação e registra essas operações no log de auditoria do SELinux. O modo permissivo é tipicamente usado durante o desenvolvimento de políticas ou a solução de problemas. No modo desativado, as políticas não são aplicadas e os contextos não são aplicados aos objetos do sistema, o que dificulta a habilitação do SELinux posteriormente.

Para ver o modo atual do SELinux, use o comando **sestatus** mencionado anteriormente ou o utilitário **getenforce**.

```sh
$> getenforce
Enforcing
```

Para alterar o modo SELinux, use o utilitário `setenforce`:

```sh
$> setenforce 0
$> getenforce
Permissive
```

```sh
$> setenforce 1
$> getenforce
Enforcing
```

As alterações feitas com o **setenforce** são perdidas quando você reinicia o sistema. Para alterar permanentemente o modo SELinux, edite o arquivo `/etc/selinux/config` e reinicie o sistema.
