### 8.1.7 Diretrizes de Segurança para Programação de Clientes

As aplicações de clientes que acessam o MySQL devem seguir as diretrizes a seguir para evitar interpretar dados externos incorretamente ou expor informações sensíveis.

* Gerenciar Dados Externos Adequadamente
* Gerenciar Mensagens de Erro do MySQL Adequadamente

#### Gerenciar Dados Externos Adequadamente

As aplicações que acessam o MySQL não devem confiar em nenhum dado inserido pelos usuários, que podem tentar enganar seu código ao inserir sequências de caracteres especiais ou escapadas em formulários da Web, URLs ou qualquer aplicativo que você tenha construído. Certifique-se de que sua aplicação permaneça segura se um usuário tentar realizar uma injeção SQL inserindo algo como `; DROP DATABASE mysql;` em um formulário. Este é um exemplo extremo, mas grandes vazamentos de segurança e perda de dados podem ocorrer como resultado de hackers usando técnicas semelhantes, se você não se preparar para isso.

Um erro comum é proteger apenas os valores de dados de string. Lembre-se de verificar os dados numéricos também. Se uma aplicação gerar uma consulta como `SELECT * FROM table WHERE ID=234` quando um usuário inserir o valor `234`, o usuário pode inserir o valor `234 OR 1=1` para fazer com que a aplicação gere a consulta `SELECT * FROM table WHERE ID=234 OR 1=1`. Como resultado, o servidor recupera cada linha da tabela. Isso expõe cada linha e causa uma carga excessiva no servidor. A maneira mais simples de se proteger contra esse tipo de ataque é usar aspas simples ao redor das constantes numéricas: `SELECT * FROM table WHERE ID='234'`. Se o usuário inserir informações extras, tudo se torna parte da string. Em um contexto numérico, o MySQL converte automaticamente essa string em um número e remove quaisquer caracteres não numéricos finais.

Às vezes, as pessoas pensam que, se um banco de dados contém apenas dados disponíveis publicamente, ele não precisa ser protegido. Isso está incorreto. Mesmo que seja permitido exibir qualquer linha no banco de dados, você ainda deve proteger contra ataques de negação de serviço (por exemplo, aqueles que são baseados na técnica do parágrafo anterior que faz o servidor desperdiçar recursos). Caso contrário, seu servidor deixa de responder a usuários legítimos.

Lista de verificação:

* Ative o modo SQL rigoroso para que o servidor seja mais restritivo em relação aos valores de dados que aceita. Veja a Seção 7.1.11, “Modos SQL do Servidor”.

* Tente inserir aspas simples e duplas (`'` e `"`) em todos os seus formulários da Web. Se você receber algum tipo de erro MySQL, investigue o problema imediatamente.

* Tente modificar URLs dinâmicas adicionando `%22` (`"`), `%23` (`#`) e `%27` (`'`) a elas.

* Tente modificar os tipos de dados em URLs dinâmicas de numeric para caracteres usando os caracteres mostrados nos exemplos anteriores. Sua aplicação deve ser segura contra esses e ataques semelhantes.

* Tente inserir caracteres, espaços e símbolos especiais em vez de números em campos numéricos. Sua aplicação deve removê-los antes de passá-los para o MySQL, caso contrário, gerará um erro. Passar valores não verificados para o MySQL é muito perigoso!

* Verifique o tamanho dos dados antes de passá-los para o MySQL.
* Faça com que sua aplicação se conecte ao banco de dados usando um nome de usuário diferente do que você usa para fins administrativos. Não dê às suas aplicações privilégios de acesso que eles não precisam.

Muitas interfaces de programação de aplicativos fornecem um meio de escapar de caracteres especiais nos valores de dados. Usado corretamente, isso impede que os usuários da aplicação insiram valores que fazem com que a aplicação gere declarações que têm um efeito diferente do que você pretende:

* MySQL SQL: Use instruções preparadas SQL e aceite valores de dados apenas por meio de marcadores; veja a Seção 15.5, “Instruções Preparadas”.

* MySQL C API: Use a chamada da API `mysql_real_escape_string_quote()`. Alternativamente, use a interface de declaração preparada da API C e aceite valores de dados apenas por meio de marcadores; veja a Interface de Declaração Preparada da API C.

* MySQL++: Use os modificadores `escape` e `quote` para fluxos de consulta.

* PHP: Use as extensões `mysqli` ou `pdo_mysql`, e não a extensã mais antiga `ext/mysql`. As extensões preferidas suportam o protocolo de autenticação MySQL aprimorado e senhas, bem como declarações preparadas com marcadores. Veja também MySQL e PHP.

  Se a extensã mais antiga `ext/mysql` precisar ser usada, então, para escapar, use a função `mysql_real_escape_string_quote()` e não `mysql_escape_string()` ou `addslashes()` porque apenas `mysql_real_escape_string_quote()` é sensível ao conjunto de caracteres; as outras funções podem ser “bypassadas” ao usar conjuntos de caracteres multibyte (inválidos).

* Perl DBI: Use marcadores ou o método `quote()`.

* Java JDBC: Use um objeto `PreparedStatement` e marcadores.

Outras interfaces de programação podem ter capacidades semelhantes.

#### Gerencie os Mensagens de Erro do MySQL Adequadamente

É responsabilidade da aplicação interceptar erros que ocorrem como resultado da execução de instruções SQL com o servidor de banco de dados MySQL e gerenciá-los adequadamente.

As informações devolvidas em um erro do MySQL não são gratuitas, pois essas informações são essenciais para depurar o MySQL usando aplicativos. Por exemplo, seria quase impossível depurar uma consulta comum de junção de 10 colunas `SELECT` sem fornecer informações sobre quais bancos de dados, tabelas e outros objetos estão envolvidos com problemas. Portanto, os erros do MySQL às vezes precisam conter referências aos nomes desses objetos.

Uma abordagem simples, mas insegura, para uma aplicação quando recebe tal erro do MySQL é interceptá-lo e exibí-lo literalmente ao cliente. No entanto, revelar informações de erro é um tipo conhecido de vulnerabilidade de aplicativo (CWE-209) e o desenvolvedor da aplicação deve garantir que a aplicação não tenha essa vulnerabilidade.

Por exemplo, uma aplicação que exibe uma mensagem como esta expõe tanto o nome de um banco de dados quanto o nome de uma tabela aos clientes, que são informações que um cliente pode tentar explorar:

```
ERROR 1146 (42S02): Table 'mydb.mytable' doesn't exist
```

Em vez disso, o comportamento adequado para uma aplicação quando recebe tal erro do MySQL é registrar informações apropriadas, incluindo as informações de erro, em um local de auditoria seguro, acessível apenas a pessoal de confiança. A aplicação pode retornar algo mais genérico, como “Erro Interno”, ao usuário.