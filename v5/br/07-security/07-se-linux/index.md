## 6.7 SELinux

6.7.1 Verifique se o SELinux está ativado

6.7.2 Alterando o Modo SELinux

Políticas de segurança SELinux do MySQL Server

6.7.4 Contexto de arquivo SELinux

6.7.5 Contexto de Porta TCP SELinux

6.7.6 Solução de problemas do SELinux

O Linux com Segurança Aprimorada (SELinux) é um sistema de controle de acesso obrigatório (MAC) que implementa os direitos de acesso aplicando uma etiqueta de segurança conhecida como *contexto SELinux* a cada objeto do sistema. Os módulos de políticas do SELinux usam contextos SELinux para definir regras sobre como processos, arquivos, portas e outros objetos do sistema interagem entre si. A interação entre objetos do sistema só é permitida se uma regra de política permitir.

Um contexto SELinux (o rótulo aplicado a um objeto do sistema) tem os seguintes campos: `user`, `role`, `type` e `level de segurança`. A informação do tipo, e não o contexto SELinux inteiro, é comumente usada para definir regras sobre como os processos interagem com outros objetos do sistema. Os módulos de políticas SELinux do MySQL, por exemplo, definem regras de política usando informações de `type`.

Você pode visualizar os contextos SELinux usando comandos do sistema operacional, como **ls** e **ps**, com a opção `-Z`. Supondo que o SELinux esteja habilitado e um servidor MySQL esteja em execução, os seguintes comandos mostram o contexto SELinux para o processo **mysqld** e o diretório de dados do MySQL:

Processo **mysqld**:

```sql
$> ps -eZ | grep mysqld
system_u:system_r:mysqld_t:s0    5924 ?        00:00:03 mysqld
```

Diretório de dados do MySQL:

```sql
$> cd /var/lib
$> ls -Z | grep mysql
system_u:object_r:mysqld_db_t:s0 mysql
```

onde:

- `system_u` é uma identidade de usuário do SELinux para processos e objetos do sistema.

- `system_r` é um papel SELinux usado para processos do sistema.

- `objetos_r` é um papel SELinux usado para objetos do sistema.

- `mysqld_t` é o tipo associado ao processo mysqld.

- `mysqld_db_t` é o tipo associado ao diretório de dados do MySQL e seus arquivos.

- `s0` é o nível de segurança.

Para obter mais informações sobre a interpretação dos contextos SELinux, consulte a documentação do SELinux da sua distribuição.
