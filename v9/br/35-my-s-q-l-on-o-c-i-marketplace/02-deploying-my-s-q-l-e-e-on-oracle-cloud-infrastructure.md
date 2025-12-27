## 34.2 Implantação do MySQL EE na Infraestrutura de Nuvem Oracle

Para implantar o MySQL EE na Infraestrutura de Nuvem Oracle, faça o seguinte:

1. Abra o Mercado Oracle Cloud e procure pelo MySQL.

   As listagens do MySQL são exibidas.

2. Selecione a Edição Empresarial do MySQL.

   A visão geral da Edição Empresarial do MySQL é exibida.

3. Clique em Iniciar Instância para iniciar o processo de lançamento da aplicação.

   A caixa de diálogo Criar Instância de Computação é exibida.

   Consulte [Para criar uma instância Linux](https://docs.cloud.oracle.com/iaas/Content/Compute/Tasks/launchinginstance.htm) para obter informações sobre como preencher os campos.

Por padrão, o servidor MySQL escuta na porta 3306 e está configurado com um único usuário, root.

Importante

Quando a implantação estiver concluída e o servidor MySQL estiver iniciado, você deve se conectar à instância de computação e recuperar a senha padrão de root, que foi escrita no arquivo de log do MySQL.

Consulte Conectar com SSH para obter mais informações.

O seguinte software MySQL está instalado:

* MySQL Server EE
* MySQL Enterprise Backup
* MySQL Shell
* MySQL Router

### Configuração do MySQL

Para segurança, os seguintes são habilitados:

[Configurando e Usando o SELinux](https://docs.oracle.com/en/operating-systems/oracle-linux/7/admin/ol7-s1-syssec.html)

[Controlando o Serviço de Firewalld Firewall](https://docs.oracle.com/en/operating-systems/oracle-linux/7/security/ol7-implement-sec.html#ol7-firewalld-cfg)

Os seguintes plugins do MySQL são habilitados:

* `thread_pool`
* `validate_password`

No início, o seguinte ocorre:

* O MySQL Server lê `/etc/my.cnf` e todos os arquivos nomeados `*.cnf` em `/etc/my.cnf.d/`.

* `/etc/my.cnf.d/perf-tuning.cnf` é criado pelo `/usr/bin/mkcnf` com base na forma OCI selecionada.

  Nota

  Para desabilitar esse mecanismo, remova `/etc/systemd/system/mysqld.service.d/perf-tuning.conf`.

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

Importante

Para todas as outras formas, o ajuste para VM.Standard2.1 é usado.