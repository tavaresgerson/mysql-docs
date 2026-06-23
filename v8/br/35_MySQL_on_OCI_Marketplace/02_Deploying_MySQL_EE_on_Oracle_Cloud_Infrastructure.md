## 34.2. Implantação do MySQL EE na Infraestrutura de Nuvem Oracle

Para implantar o MySQL EE na Infraestrutura de Nuvem da Oracle, faça o seguinte:

1. Abra o OCI Marketplace e selecione MySQL.

A listagem do MySQL é exibida.

2. Clique em Iniciar Instância para iniciar o processo de lançamento do aplicativo.

A caixa de diálogo Criar instância de computação é exibida.

Veja [Para criar uma instância Linux][(https://docs.cloud.oracle.com/iaas/Content/Compute/Tasks/launchinginstance.htm)] para obter informações sobre como preencher os campos.

Por padrão, o servidor MySQL escuta na porta 3306 e é configurado com um único usuário, root.

Importante

Quando a implantação estiver concluída e o servidor MySQL estiver iniciado, você deve se conectar à instância de computação e recuperar a senha padrão do root que foi escrita no arquivo de registro do MySQL.

Veja Conectar-se com SSH para mais informações.

O seguinte software MySQL está instalado:

* MySQL Server EE
* MySQL Enterprise Backup
* MySQL Shell
* MySQL Router

### Configuração do MySQL

Por segurança, o seguinte está habilitado:

* SELinux: para mais informações, consulte [Configurando e usando SELinux][(https://docs.oracle.com/en/operating-systems/oracle-linux/7/admin/ol7-s1-syssec.html)]

* `firewalld`: para mais informações, consulte o controle do serviço de firewalld Firewall Service [(https://docs.oracle.com/en/operating-systems/oracle-linux/7/security/ol7-implement-sec.html#ol7-firewalld-cfg)]

Os seguintes plugins do MySQL estão habilitados:

* `thread_pool`
* `validate_password`

Ao iniciar, o seguinte ocorre:

* O MySQL Server lê `/etc/my.cnf` e todos os arquivos com o nome `*.cnf` em `/etc/my.cnf.d/`.

* `/etc/my.cnf.d/perf-tuning.cnf` é criado por `/usr/bin/mkcnf` com base na forma OCI selecionada.

Nota

Para desativar esse mecanismo, remova `/etc/systemd/system/mysqld.service.d/perf-tuning.conf`.

O ajuste de desempenho é configurado para as seguintes formas:

+ VM.Standard2.1
+ VM.Standard2.2
+ VM.Standard2.4
+ VM.Standard2.8
+ VM.Standard2.16
+ VM.Standard2.24
+ VM.Standard.E2.1
+ VM.Standard.E2.2
+ VM.Standard.E2.4
+ VM.Standard.E2.8
+ VM.Standard.E3.Flex
+ VM.Standard.E4.Flex
+ BM.Standard2.52

Para todas as outras formas, o ajuste para VM.Standard2.1 é utilizado.