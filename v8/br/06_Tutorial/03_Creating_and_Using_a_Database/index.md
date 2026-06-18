## 5.3 Criando e usando um banco de dados

5.3.1 Criando e selecionando um banco de dados

5.3.2 Criando uma Tabela

5.3.3 Carregamento de dados em uma tabela

5.3.4 Recuperação de informações de uma tabela

Depois de saber como inserir instruções SQL, você está pronto para acessar um banco de dados.

Suponha que você tenha vários animais de estimação em sua casa (sua zoológico) e queira acompanhar vários tipos de informações sobre eles. Você pode fazer isso criando tabelas para armazenar seus dados e carregando-as com as informações desejadas. Em seguida, você pode responder a diferentes tipos de perguntas sobre seus animais, recuperando dados das tabelas. Esta seção mostra como realizar as seguintes operações:

- Criar um banco de dados
- Crie uma tabela
- Carregue dados na tabela
- Recuperar dados da tabela de várias maneiras
- Use múltiplas tabelas

O banco de dados da menagerie é simples (deliberadamente), mas não é difícil imaginar situações do mundo real em que um banco de dados desse tipo poderia ser usado. Por exemplo, um banco de dados como esse poderia ser usado por um fazendeiro para acompanhar o gado, ou por um veterinário para manter registros de pacientes. Uma distribuição da menagerie contendo algumas das consultas e dados de amostra usados nas seções seguintes pode ser obtida no site do MySQL. Está disponível tanto em formato **tar** comprimido quanto em formato Zip em <https://dev.mysql.com/doc/>.

Use a declaração `SHOW` para descobrir quais bancos de dados existem atualmente no servidor:

```
mysql> SHOW DATABASES;
+----------+
| Database |
+----------+
| mysql    |
| test     |
| tmp      |
+----------+
```

O banco de dados `mysql` descreve os privilégios de acesso dos usuários. O banco de dados `test` geralmente está disponível como um espaço de trabalho para que os usuários possam experimentar coisas.

A lista de bancos de dados exibida pelo comando pode ser diferente na sua máquina; `SHOW DATABASES` não exibe bancos de dados para os quais você não tenha privilégios, se você não tiver o privilégio `SHOW DATABASES`. Veja a Seção 15.7.7.14, “Comando SHOW DATABASES”.

Se o banco de dados `test` existir, tente acessá-lo:

```
mysql> USE test
Database changed
```

`USE`, assim como `QUIT`, não requer um ponto e vírgula. (Você pode terminar essas declarações com um ponto e vírgula, se preferir; isso não faz mal algum.) A declaração `USE` é especial também de outra maneira: ela deve ser dada em uma única linha.

Você pode usar o banco de dados `test` (se tiver acesso a ele) para os exemplos a seguir, mas qualquer coisa que você criar nesse banco de dados pode ser removida por qualquer outra pessoa que tenha acesso a ele. Por essa razão, você provavelmente deve pedir ao seu administrador do MySQL permissão para usar um banco de dados próprio. Suponha que você queira chamar o seu `menagerie`. O administrador precisa executar uma declaração como esta:

```
mysql> GRANT ALL ON menagerie.* TO 'your_mysql_name'@'your_client_host';
```

onde `your_mysql_name` é o nome do usuário do MySQL atribuído a você e `your_client_host` é o host a partir do qual você se conecta ao servidor.
