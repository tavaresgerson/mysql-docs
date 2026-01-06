### 6.2.1 Nomes de Usuários e Senhas de Conta

O MySQL armazena as contas na tabela `user` do banco de dados do sistema `mysql`. Uma conta é definida em termos de um nome de usuário e do(s) host(es) do cliente a partir do qual o usuário pode se conectar ao servidor. Para obter informações sobre a representação da conta na tabela `user`, consulte Seção 6.2.3, “Tabelas de Concessão”.

Uma conta também pode ter credenciais de autenticação, como uma senha. As credenciais são gerenciadas pelo plugin de autenticação da conta. O MySQL suporta vários plugins de autenticação. Alguns deles usam métodos de autenticação integrados, enquanto outros permitem a autenticação usando métodos de autenticação externos. Veja Seção 6.2.13, “Autenticação Pluggable”.

Há várias distinções entre a forma como os nomes de usuário e senhas são usados pelo MySQL e pelo seu sistema operacional:

- Os nomes de usuário, como usados pelo MySQL para fins de autenticação, não têm nada a ver com os nomes de usuário (nomes de login) usados pelo Windows ou Unix. No Unix, a maioria dos clientes MySQL, por padrão, tenta fazer login usando o nome de usuário Unix atual como o nome de usuário MySQL, mas isso é apenas para conveniência. O padrão pode ser facilmente ignorado, porque os programas cliente permitem que qualquer nome de usuário seja especificado com a opção `-u` ou `--user`. Isso significa que qualquer pessoa pode tentar se conectar ao servidor usando qualquer nome de usuário, então você não pode tornar um banco de dados seguro de nenhuma maneira, a menos que todas as contas do MySQL tenham senhas. Qualquer pessoa que especifique um nome de usuário para uma conta que não tem senha pode se conectar com sucesso ao servidor.

- Os nomes de usuário do MySQL podem ter até 32 caracteres. Os nomes de usuário do sistema operacional podem ter um comprimento máximo diferente.

  Aviso

  O limite de comprimento do nome do usuário do MySQL está hardcoded nos servidores e clientes do MySQL, e tentar contorná-lo modificando as definições das tabelas no banco de dados \`mysql *não funciona*.

  Você nunca deve alterar a estrutura das tabelas no banco de dados `mysql` de qualquer maneira, exceto por meio do procedimento descrito em Seção 2.10, “Atualização do MySQL”. Tentar redefinir as tabelas do sistema MySQL de qualquer outra forma resulta em comportamento indefinido e não suportado. O servidor é livre para ignorar linhas que se tornam malformadas como resultado dessas modificações.

- Para autenticar as conexões dos clientes para contas que utilizam métodos de autenticação integrados, o servidor usa senhas armazenadas na tabela `user`. Essas senhas são distintas das senhas para fazer login no seu sistema operacional. Não há conexão necessária entre a senha "externa" que você usa para fazer login em uma máquina Windows ou Unix e a senha que você usa para acessar o servidor MySQL naquela máquina.

  Se o servidor autenticar um cliente usando algum outro plugin, o método de autenticação que o plugin implementa pode ou não usar uma senha armazenada na tabela `user`. Nesse caso, é possível que uma senha externa também seja usada para autenticar-se no servidor MySQL.

- As senhas armazenadas na tabela `user` são criptografadas usando algoritmos específicos do plugin. Para obter informações sobre a criptografia de senhas nativa do MySQL, consulte Seção 6.1.2.4, “Criptografia de Senhas no MySQL”.

- Se o nome de usuário e a senha contiverem apenas caracteres ASCII, é possível se conectar ao servidor, independentemente das configurações do conjunto de caracteres. Para habilitar conexões quando o nome de usuário ou a senha contiverem caracteres não ASCII, as aplicações cliente devem chamar a função da API C `mysql_options()` com a opção `MYSQL_SET_CHARSET_NAME` e o nome apropriado do conjunto de caracteres como argumentos. Isso faz com que a autenticação ocorra usando o conjunto de caracteres especificado. Caso contrário, a autenticação falha, a menos que o conjunto de caracteres padrão do servidor seja o mesmo que o codificação nos padrões de autenticação.

  Os programas padrão de cliente MySQL suportam a opção `--default-character-set`, que faz com que `mysql_options()` seja chamada conforme descrito. Além disso, a autodetecção do conjunto de caracteres é suportada conforme descrito em Seção 10.4, “Conjunto de caracteres de conexão e colagens”. Para programas que usam um conector que não é baseado na API C, o conector pode fornecer um equivalente a `mysql_options()` que pode ser usado em vez disso. Verifique a documentação do conector.

  As notas anteriores não se aplicam a `ucs2`, `utf16` e `utf32`, que não são permitidos como conjuntos de caracteres do cliente.

O processo de instalação do MySQL preenche as tabelas de concessão com uma conta inicial `root`, conforme descrito em Seção 2.9.4, “Segurança da Conta Inicial do MySQL”, que também discute como atribuir uma senha a ela. Em seguida, você normalmente configura, modifica e remove contas do MySQL usando instruções como `CREATE USER`, `DROP USER`, `GRANT` e `REVOKE`. Veja Seção 6.2.7, “Adicionar Contas, Atribuir Privilegios e Remover Contas” e Seção 13.7.1, “Instruções de Gerenciamento de Contas”.

Para se conectar a um servidor MySQL com um cliente de linha de comando, especifique as opções de nome de usuário e senha conforme necessário para a conta que você deseja usar:

```sql
$> mysql --user=finley --password db_name
```

Se você prefere opções curtas, o comando é o seguinte:

```sql
$> mysql -u finley -p db_name
```

Se você omitir o valor da senha após a opção `--password` (connection-options.html#option\_general\_password) ou `-p` na linha de comando (como mostrado acima), o cliente solicitará uma senha. Alternativamente, a senha pode ser especificada na linha de comando:

```sql
$> mysql --user=finley --password=password db_name
$> mysql -u finley -ppassword db_name
```

Se você usar a opção `-p`, não pode haver *espaço* entre `-p` e o valor da senha a seguir.

Especificar uma senha na linha de comando deve ser considerado inseguro. Consulte Seção 6.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”. Para evitar fornecer a senha na linha de comando, use um arquivo de opção ou um arquivo de caminho de login. Consulte Seção 4.2.2.2, “Uso de Arquivos de Opção” e Seção 4.6.6, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre a especificação de nomes de usuário, senhas e outros parâmetros de conexão, consulte Seção 4.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.
