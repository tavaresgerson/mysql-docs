## 6.7 SELinux

[6.7.1 Verificar se o SELinux está Habilitado](selinux-checking.html)

[6.7.2 Alterando o Modo do SELinux](selinux-mode.html)

[6.7.3 Policies do SELinux para o MySQL Server](selinux-policies.html)

[6.7.4 Context do Arquivo SELinux](selinux-file-context.html)

[6.7.5 Context da Porta TCP SELinux](selinux-context-tcp-port.html)

[6.7.6 Solução de Problemas do SELinux (Troubleshooting)](selinux-troubleshooting.html)

Security-Enhanced Linux (SELinux) é um sistema de controle de acesso obrigatório (MAC - Mandatory Access Control) que implementa direitos de acesso aplicando um rótulo de segurança, denominado *SELinux context*, a cada objeto do sistema. Os módulos de Policy do SELinux usam SELinux contexts para definir regras sobre como os Processes, arquivos, portas e outros objetos do sistema interagem entre si. A interação entre objetos do sistema é permitida apenas se uma regra de Policy o permitir.

Um SELinux context (o rótulo aplicado a um objeto do sistema) possui os seguintes campos: `user`, `role`, `type` e `security level`. A informação de Type, em vez do SELinux context completo, é usada mais comumente para definir regras sobre como os Processes interagem com outros objetos do sistema. Os módulos de Policy do SELinux para MySQL, por exemplo, definem regras de Policy usando informações de `type`.

Você pode visualizar SELinux contexts usando comandos do sistema operacional, como **ls** e **ps**, com a opção `-Z`. Assumindo que o SELinux esteja habilitado e um MySQL Server esteja em execução, os comandos a seguir mostram o SELinux context para o Process [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") e o MySQL data directory:

Process [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"):

```sql
$> ps -eZ | grep mysqld
system_u:system_r:mysqld_t:s0    5924 ?        00:00:03 mysqld
```

MySQL data directory:

```sql
$> cd /var/lib
$> ls -Z | grep mysql
system_u:object_r:mysqld_db_t:s0 mysql
```

onde:

* `system_u` é uma identidade de user SELinux para Processes e objetos do sistema.

* `system_r` é um role SELinux usado para Processes do sistema.

* `objects_r` é um role SELinux usado para objetos do sistema.

* `mysqld_t` é o type associado ao Process mysqld.

* `mysqld_db_t` é o type associado ao MySQL data directory e seus arquivos.

* `s0` é o security level.

Para obter mais informações sobre a interpretação de SELinux contexts, consulte a documentação SELinux da sua distribuição.