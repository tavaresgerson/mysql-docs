### 6.1.7 Diretrizes de segurança para programação de clientes

As aplicações de clientes que acessam o MySQL devem seguir as diretrizes a seguir para evitar interpretar dados externos incorretamente ou expor informações sensíveis.

- Gerenciar dados externos corretamente
- Manipule os Mensagens de Erro do MySQL corretamente

#### Lidar com dados externos corretamente

As aplicações que acessam o MySQL não devem confiar em nenhum dado inserido pelos usuários, que podem tentar enganar seu código ao inserir sequências de caracteres especiais ou escapadas em formulários da Web, URLs ou qualquer aplicativo que você tenha criado. Certifique-se de que sua aplicação permaneça segura se um usuário tentar realizar uma injeção SQL inserindo algo como `; DROP DATABASE mysql;` em um formulário. Este é um exemplo extremo, mas vazamentos de segurança graves e perda de dados podem ocorrer como resultado de hackers usando técnicas semelhantes, se você não se preparar para isso.

Um erro comum é proteger apenas os valores de dados de texto. Lembre-se de verificar também os dados numéricos. Se um aplicativo gerar uma consulta como `SELECT * FROM table WHERE ID=234` quando um usuário inserir o valor `234`, o usuário pode inserir o valor `234 OR 1=1` para fazer com que o aplicativo gere a consulta `SELECT * FROM table WHERE ID=234 OR 1=1`. Como resultado, o servidor recupera todas as linhas da tabela. Isso expõe todas as linhas e causa uma carga excessiva no servidor. A maneira mais simples de se proteger desse tipo de ataque é usar aspas simples ao redor das constantes numéricas: `SELECT * FROM table WHERE ID='234'`. Se o usuário inserir informações extras, tudo se torna parte do texto. Em um contexto numérico, o MySQL converte automaticamente esse texto em um número e remove quaisquer caracteres não numéricos finais.

Às vezes, as pessoas pensam que, se um banco de dados contém apenas dados disponíveis publicamente, ele não precisa ser protegido. Isso está incorreto. Mesmo que seja permitido exibir qualquer linha no banco de dados, você ainda deve proteger contra ataques de negação de serviço (por exemplo, aqueles que são baseados na técnica do parágrafo anterior que faz o servidor desperdiçar recursos). Caso contrário, seu servidor deixa de responder aos usuários legítimos.

Lista de verificação:

- Ative o modo SQL rigoroso para informar ao servidor que ele deve ser mais restritivo em relação aos valores de dados que aceita. Veja Seção 5.1.10, “Modos SQL do Servidor”.

- Tente inserir aspas simples e duplas (`'` e `"`) em todos os seus formulários da Web. Se você receber algum tipo de erro MySQL, investigue o problema imediatamente.

- Tente modificar URLs dinâmicas adicionando `%22` (`"`), `%23` (`#`) e `%27` (`'`) a elas.

- Tente modificar os tipos de dados em URLs dinâmicas de números para tipos de caracteres usando os caracteres mostrados nos exemplos anteriores. Sua aplicação deve ser segura contra esses e ataques semelhantes.

- Tente inserir caracteres, espaços e símbolos especiais em vez de números em campos numéricos. Sua aplicação deve removê-los antes de passá-los para o MySQL, caso contrário, gerará um erro. Passar valores não verificados para o MySQL é muito perigoso!

- Verifique o tamanho dos dados antes de passá-los para o MySQL.

- Faça com que sua aplicação se conecte ao banco de dados usando um nome de usuário diferente do que você usa para fins administrativos. Não dê às suas aplicações quaisquer privilégios de acesso que não sejam necessários.

Muitas interfaces de programação de aplicativos oferecem uma maneira de escapar de caracteres especiais nos valores de dados. Quando usadas corretamente, isso impede que os usuários do aplicativo digitem valores que causem a geração de declarações com um efeito diferente do desejado:

- Instruções SQL do MySQL: Use instruções preparadas SQL e aceite valores de dados apenas por meio de marcadores; veja Seção 13.5, “Instruções Preparadas”.

- API MySQL C: Use a chamada da API `mysql_real_escape_string_quote()`. Alternativamente, use a interface de declaração preparada da API C e aceite valores de dados apenas por meio de marcadores; veja Interface de Declaração Preparada da API C.

- MySQL++: Use os modificadores `escape` e `quote` para fluxos de consulta.

- PHP: Use as extensões `mysqli` ou `pdo_mysql`, e não a extensão mais antiga `ext/mysql`. As APIs preferidas suportam o protocolo de autenticação MySQL aprimorado e senhas, além de declarações preparadas com marcadores. Veja também MySQL e PHP.

  Se a extensão mais antiga `ext/mysql` precisar ser usada, para escapar, utilize a função `mysql_real_escape_string_quote()` e não `mysql_escape_string()` ou `addslashes()` porque apenas `mysql_real_escape_string_quote()` é sensível ao conjunto de caracteres; as outras funções podem ser “desligadas” ao usar conjuntos de caracteres multibyte (inválidos).

- Perl DBI: Use marcadores ou o método `quote()`.

- Java JDBC: Use um objeto `PreparedStatement` e marcadores.

Outras interfaces de programação podem ter capacidades semelhantes.

#### Lidar com os Mensagens de Erro do MySQL de Forma Correta

É responsabilidade do aplicativo interceptar erros que ocorrem como resultado da execução de instruções SQL com o servidor de banco de dados MySQL e lidar com eles de forma apropriada.

As informações devolvidas em um erro do MySQL não são gratuitas, pois essas informações são essenciais para depurar o MySQL usando aplicativos. Por exemplo, seria quase impossível depurar uma declaração comum de junção de 10 maneiras `SELECT` sem fornecer informações sobre quais bancos de dados, tabelas e outros objetos estão envolvidos com problemas. Assim, os erros do MySQL às vezes precisam conter referências aos nomes desses objetos.

Uma abordagem simples, mas insegura, para uma aplicação quando recebe esse tipo de erro do MySQL é interceptá-lo e exibí-lo literalmente ao cliente. No entanto, revelar informações de erro é um tipo conhecido de vulnerabilidade de aplicação (CWE-209) e o desenvolvedor da aplicação deve garantir que a aplicação não tenha essa vulnerabilidade.

Por exemplo, um aplicativo que exibe uma mensagem como essa expõe tanto o nome do banco de dados quanto o nome da tabela aos clientes, o que é uma informação que um cliente pode tentar explorar:

```sql
ERROR 1146 (42S02): Table 'mydb.mytable' does not exist
```

Em vez disso, o comportamento adequado de uma aplicação quando recebe um erro do MySQL é registrar informações apropriadas, incluindo as informações do erro, em um local de auditoria seguro, acessível apenas a pessoal de confiança. A aplicação pode retornar algo mais genérico, como “Erro interno”, ao usuário.
