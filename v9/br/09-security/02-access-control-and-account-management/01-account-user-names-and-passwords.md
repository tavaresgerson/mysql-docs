### 8.2.1 Nomes de Usuários e Senhas de Conta

O MySQL armazena contas na tabela `user` do banco de dados do sistema `mysql`. Uma conta é definida em termos de um nome de usuário e do(s) host(s) do cliente a partir do qual o usuário pode se conectar ao servidor. Para obter informações sobre a representação da conta na tabela `user`, consulte a Seção 8.2.3, “Tabelas de Concessão”.

Uma conta também pode ter credenciais de autenticação, como uma senha. As credenciais são gerenciadas pelo plugin de autenticação da conta. O MySQL suporta vários plugins de autenticação. Alguns deles usam métodos de autenticação integrados, enquanto outros permitem a autenticação usando métodos de autenticação externos. Consulte a Seção 8.2.17, “Autenticação Extensível”.

Há várias distinções entre a maneira como os nomes de usuário e as senhas são usados pelo MySQL e pelo seu sistema operacional:

* Os nomes de usuário, como usados pelo MySQL para fins de autenticação, não têm nada a ver com os nomes de usuário (nomes de login) usados pelo Windows ou Unix. No Unix, a maioria dos clientes MySQL tenta, por padrão, fazer login usando o nome de usuário atual do Unix como o nome de usuário do MySQL, mas isso é apenas para conveniência. O padrão pode ser facilmente sobrescrito, porque os programas cliente permitem que qualquer nome de usuário seja especificado com a opção `-u` ou `--user`. Isso significa que qualquer pessoa pode tentar se conectar ao servidor usando qualquer nome de usuário, então você não pode tornar uma base de dados segura de qualquer maneira, a menos que todas as contas do MySQL tenham senhas. Qualquer pessoa que especifique um nome de usuário para uma conta que não tem senha pode se conectar com sucesso ao servidor.

* Os nomes de usuário do MySQL têm até 32 caracteres de comprimento. Os nomes de usuário do sistema operacional podem ter um comprimento máximo diferente.

**Aviso**

O limite de comprimento do nome do usuário do MySQL está hardcoded nos servidores e clientes do MySQL, e tentar contorná-lo modificando as definições das tabelas no banco de dados `mysql *não funciona*.

Você nunca deve alterar a estrutura das tabelas no banco de dados `mysql` de qualquer maneira, exceto por meio do procedimento descrito no Capítulo 3, *Atualizando o MySQL*. Tentar redefinir as tabelas do sistema do MySQL de qualquer outra forma resulta em comportamento indefinido e não suportado. O servidor é livre para ignorar linhas que se tornam malformadas como resultado de tais modificações.

* Para autenticar conexões de clientes para contas que usam métodos de autenticação integrados, o servidor usa senhas armazenadas na tabela `user`. Essas senhas são distintas das senhas para fazer login no seu sistema operacional. Não há conexão necessária entre a senha "externa" que você usa para fazer login em uma máquina Windows ou Unix e a senha que você usa para acessar o servidor MySQL naquela máquina.

* Se o servidor autenticar um cliente usando algum outro plugin, o método de autenticação que o plugin implementa pode ou não usar uma senha armazenada na tabela `user`. Neste caso, é possível que uma senha externa também seja usada para autenticar-se no servidor MySQL.

* As senhas armazenadas na tabela `user` são criptografadas usando algoritmos específicos do plugin.

* Se o nome de usuário e a senha contiverem apenas caracteres ASCII, é possível se conectar ao servidor independentemente das configurações do conjunto de caracteres. Para habilitar conexões quando o nome de usuário ou a senha contiverem caracteres não ASCII, as aplicações cliente devem chamar a função C `mysql_options()` com a opção `MYSQL_SET_CHARSET_NAME` e o nome apropriado do conjunto de caracteres como argumentos. Isso faz com que a autenticação ocorra usando o conjunto de caracteres especificado. Caso contrário, a autenticação falha, a menos que o conjunto de caracteres padrão do servidor seja o mesmo que o codificação nos padrões de autenticação.

Os programas padrão de cliente MySQL suportam uma opção `--default-character-set` que faz com que `mysql_options()` seja chamada como descrito acima. Além disso, a autodetecção do conjunto de caracteres é suportada conforme descrito na Seção 12.4, “Conjunto de caracteres de conexão e colagens”. Para programas que usam um conector que não é baseado na API C, o conector pode fornecer um equivalente a `mysql_options()` que pode ser usado em vez disso. Ver a documentação do conector.

As notas anteriores não se aplicam a `ucs2`, `utf16` e `utf32`, que não são permitidos como conjuntos de caracteres cliente.

O processo de instalação do MySQL popula as tabelas de concessão com uma conta `root` inicial, conforme descrito na Seção 2.9.4, “Segurança da Conta Inicial do MySQL”, que também discute como atribuir uma senha a ela. Posteriormente, você normalmente configura, modifica e remove contas MySQL usando instruções como `CREATE USER`, `DROP USER`, `GRANT` e `REVOKE`. Veja a Seção 8.2.8, “Adicionar contas, atribuir privilégios e remover contas”, e a Seção 15.7.1, “Instruções de gerenciamento de contas”.

Para se conectar a um servidor MySQL com um cliente de linha de comando, especifique as opções de nome de usuário e senha conforme necessário para a conta que você deseja usar:

```
$> mysql --user=finley --password db_name
```

Se você prefere opções curtas, o comando parece assim:

```
$> mysql -u finley -p db_name
```

Se você omitir o valor da senha após a opção `--password` ou `-p` na linha de comando (como mostrado acima), o cliente solicitará uma senha. Alternativamente, a senha pode ser especificada na linha de comando:

```
$> mysql --user=finley --password=password db_name
$> mysql -u finley -ppassword db_name
```

Se você usar a opção `-p`, não deve haver *espaço* entre `-p` e o valor da senha a seguir.

Especificar uma senha na linha de comando deve ser considerado inseguro. Consulte a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”. Para evitar fornecer a senha na linha de comando, use um arquivo de opções ou um arquivo de caminho de login. Consulte a Seção 6.2.2.2, “Usando Arquivos de Opções”, e a Seção 6.6.7, “mysql\_config\_editor — Ferramenta de Configuração do MySQL”.

Para obter informações adicionais sobre a especificação de nomes de usuário, senhas e outros parâmetros de conexão, consulte a Seção 6.2.4, “Conectando ao Servidor MySQL Usando Opções de Comando”.