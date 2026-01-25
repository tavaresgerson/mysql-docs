### 6.1.7 Diretrizes de Segurança para Programação de Cliente

Aplicações Client que acessam o MySQL devem seguir as diretrizes abaixo para evitar a interpretação incorreta de dados externos ou a exposição de informações sensíveis.

* [Trate Dados Externos de Maneira Adequada](secure-client-programming.html#client-external-data-handling "Trate Dados Externos de Maneira Adequada")
* [Trate Mensagens de Erro do MySQL de Maneira Adequada](secure-client-programming.html#client-mysql-error-handling "Trate Mensagens de Erro do MySQL de Maneira Adequada")

#### Trate Dados Externos de Maneira Adequada

Aplicações que acessam o MySQL não devem confiar em nenhum dado inserido por usuários, que podem tentar enganar seu código inserindo sequências de caracteres especiais ou escapados em formulários Web, URLs, ou qualquer aplicação que você tenha construído. Certifique-se de que sua aplicação permaneça segura se um usuário tentar executar uma SQL injection inserindo algo como `; DROP DATABASE mysql;` em um formulário. Este é um exemplo extremo, mas grandes vazamentos de segurança e perda de dados podem ocorrer como resultado de hackers usando técnicas semelhantes, caso você não se prepare para elas.

Um erro comum é proteger apenas valores de dados do tipo string. Lembre-se de verificar dados numéricos também. Se uma aplicação gera uma Query como `SELECT * FROM table WHERE ID=234` quando um usuário insere o valor `234`, o usuário pode inserir o valor `234 OR 1=1` para fazer com que a aplicação gere a Query `SELECT * FROM table WHERE ID=234 OR 1=1`. Como resultado, o server recupera todas as rows na table. Isso expõe todas as rows e causa uma carga excessiva no server. A maneira mais simples de proteger contra esse tipo de ataque é usar aspas simples ao redor das constantes numéricas: `SELECT * FROM table WHERE ID='234'`. Se o usuário inserir informações extras, tudo se torna parte da string. Em um contexto numérico, o MySQL converte automaticamente essa string para um número e remove quaisquer caracteres não numéricos subsequentes.

Às vezes, as pessoas pensam que, se um Database contém apenas dados disponíveis publicamente, ele não precisa ser protegido. Isso está incorreto. Mesmo que seja permitido exibir qualquer row no Database, você ainda deve proteger contra ataques de negação de serviço (denial of service attacks) (por exemplo, aqueles baseados na técnica do parágrafo anterior que faz com que o server desperdice recursos). Caso contrário, seu server se tornará sem resposta para usuários legítimos.

Checklist:

* Habilite o modo SQL estrito para instruir o server a ser mais restritivo quanto aos valores de dados que ele aceita. Veja [Seção 5.1.10, “Modos SQL do Server”](sql-mode.html "5.1.10 Modos SQL do Server").

* Tente inserir aspas simples e duplas (`'` e `"`) em todos os seus formulários Web. Se você receber qualquer tipo de erro do MySQL, investigue o problema imediatamente.

* Tente modificar URLs dinâmicas adicionando `%22` (`"`), `%23` (`#`), e `%27` (`'`) a elas.

* Tente modificar tipos de dados em URLs dinâmicas de numéricos para tipos de caracteres usando os caracteres mostrados nos exemplos anteriores. Sua aplicação deve estar segura contra estes e ataques semelhantes.

* Tente inserir caracteres, espaços e símbolos especiais em vez de números em campos numéricos. Sua aplicação deve removê-los antes de passá-los ao MySQL ou, caso contrário, gerar um erro. Passar valores não verificados para o MySQL é muito perigoso!

* Verifique o tamanho dos dados antes de passá-los para o MySQL.
* Faça sua aplicação se conectar ao Database usando um user name diferente daquele que você usa para fins administrativos. Não conceda às suas aplicações quaisquer privilégios de acesso de que elas não precisem.

Muitas application programming interfaces (APIs) fornecem um meio de escapar caracteres especiais em valores de dados. Usado corretamente, isso impede que usuários da aplicação insiram valores que façam com que a aplicação gere comandos que tenham um efeito diferente do pretendido:

* Comandos SQL do MySQL: Use prepared statements SQL e aceite valores de dados apenas por meio de placeholders; veja [Seção 13.5, “Prepared Statements”](sql-prepared-statements.html "13.5 Prepared Statements").

* API C do MySQL: Use a chamada de API [`mysql_real_escape_string_quote()`](/doc/c-api/5.7/en/mysql-real-escape-string-quote.html). Alternativamente, use a interface de prepared statement da API C e aceite valores de dados apenas por meio de placeholders; veja [C API Prepared Statement Interface](/doc/c-api/5.7/en/c-api-prepared-statement-interface.html).

* MySQL++: Use os modificadores `escape` e `quote` para Query streams.

* PHP: Use as extensões `mysqli` ou `pdo_mysql`, e não a extensão mais antiga `ext/mysql`. As APIs preferenciais suportam o protocolo de autenticação e senhas aprimorados do MySQL, bem como prepared statements com placeholders. Veja também [MySQL and PHP](/doc/apis-php/en/).

  Se a extensão mais antiga `ext/mysql` precisar ser usada, então para escaping utilize a função [`mysql_real_escape_string_quote()`](/doc/c-api/5.7/en/mysql-real-escape-string-quote.html) e não [`mysql_escape_string()`](/doc/c-api/5.7/en/mysql-escape-string.html) ou `addslashes()`, pois apenas [`mysql_real_escape_string_quote()`](/doc/c-api/5.7/en/mysql-real-escape-string-quote.html) tem consciência do character set (é character set-aware); as outras funções podem ser “contornadas” ao usar character sets multibyte (inválidos).

* Perl DBI: Use placeholders ou o método `quote()`.

* Java JDBC: Use um objeto `PreparedStatement` e placeholders.

Outras interfaces de programação podem ter recursos semelhantes.

#### Trate Mensagens de Erro do MySQL de Maneira Adequada

É responsabilidade da aplicação interceptar os errors que ocorrem como resultado da execução de comandos SQL com o server do Database MySQL e tratá-los de maneira apropriada.

A informação retornada em um error do MySQL não é gratuita, pois essa informação é fundamental para o debugging de aplicações que usam o MySQL. Seria quase impossível, por exemplo, fazer o debug de um comando [`SELECT`](select.html "13.2.9 SELECT Statement") comum com JOIN de 10 vias sem fornecer informações sobre quais Databases, tables e outros objetos estão envolvidos nos problemas. Assim, os errors do MySQL devem, por vezes, necessariamente conter referências aos nomes desses objetos.

Uma abordagem simples, mas insegura, para uma aplicação ao receber tal error do MySQL é interceptá-lo e exibi-lo literalmente ao client. No entanto, revelar informações de error é um tipo de vulnerabilidade de aplicação conhecida ([CWE-209](http://cwe.mitre.org/data/definitions/209.html)) e o desenvolvedor da aplicação deve garantir que a aplicação não possua essa vulnerabilidade.

Por exemplo, uma aplicação que exibe uma mensagem como esta expõe tanto um nome de Database quanto um nome de table aos clients, o que é uma informação que um client pode tentar explorar:

```sql
ERROR 1146 (42S02): Table 'mydb.mytable' does not exist
```

Em vez disso, o comportamento adequado para uma aplicação ao receber tal error do MySQL é registrar (log) as informações apropriadas, incluindo os detalhes do error, em um local de auditoria seguro acessível apenas a pessoal confiável. A aplicação pode retornar algo mais genérico, como “Erro Interno”, para o usuário.