## 34.2. Implantação do MySQL EE na Infraestrutura de Nuvem da Oracle

Para implantar o MySQL EE na Infraestrutura de Nuvem da Oracle, faça o seguinte:

1. Abra o Mercado OCI e selecione MySQL.

   A listagem do MySQL é exibida.

2. Clique em Iniciar Instância para iniciar o processo de lançamento do aplicativo.

   A caixa de diálogo Criar Instância de Computação é exibida.

   Veja Para criar uma instância do Linux, consulte as informações sobre como preencher os campos.

Por padrão, o servidor MySQL escuta na porta 3306 e é configurado com um único usuário, root.

Importante

Quando a implantação estiver concluída e o servidor MySQL estiver iniciado, você deve se conectar à instância de computação e recuperar a senha padrão do root, que foi escrita no arquivo de log do MySQL.

Veja Conectar com SSH para obter mais informações.

O seguinte software MySQL está instalado:

- MySQL Server EE
- MySQL Enterprise Backup
- MySQL Shell
- MySQL Router

### Configuração do MySQL

Para segurança, os seguintes recursos estão ativados:

- SELinux: para mais informações, consulte Configurando e usando o SELinux

- `firewalld`: para mais informações, consulte o artigo Controlando o serviço de firewalld

Os seguintes plugins do MySQL estão habilitados:

- `thread_pool`
- `validate_password`

Ao iniciar, o seguinte ocorre:

- O MySQL Server lê `/etc/my.cnf` e todos os arquivos com o nome `*.cnf` em `/etc/my.cnf.d/`.

- `/etc/my.cnf.d/perf-tuning.cnf` é criado por `/usr/bin/mkcnf` com base na forma OCI selecionada.

  Nota

  Para desativar esse mecanismo, remova `/etc/systemd/system/mysqld.service.d/perf-tuning.conf`.

  O ajuste de desempenho é configurado para as seguintes formas:

  - VM.Standard2.1
  - VM.Standard2.2
  - VM.Standard2.4
  - VM.Standard2.8
  - VM.Standard2.16
  - VM.Standard2.24
  - VM.Standard.E2.1
  - VM.Standard.E2.2
  - VM.Standard.E2.4
  - VM.Standard.E2.8
  - VM.Standard.E3.Flex
  - VM.Standard.E4.Flex
  - BM.Standard2.52

  Para todas as outras formas, o ajuste para VM.Standard2.1 é usado.
