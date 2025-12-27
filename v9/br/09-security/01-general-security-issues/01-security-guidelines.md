### 8.1.1 Diretrizes de Segurança

Qualquer pessoa que use o MySQL em um computador conectado à Internet deve ler esta seção para evitar os erros de segurança mais comuns.

Ao discutir segurança, é necessário considerar a proteção completa do host do servidor (e não apenas o servidor MySQL) contra todos os tipos de ataques aplicáveis: escuta, alteração, reprodução e negação de serviço. Não cobrimos todos os aspectos de disponibilidade e tolerância a falhas aqui.

O MySQL utiliza a segurança com base em Listas de Controle de Acesso (ACLs) para todas as conexões, consultas e outras operações que os usuários podem tentar realizar. Também há suporte para conexões criptografadas com SSL entre clientes e servidores MySQL. Muitos dos conceitos discutidos aqui não são específicos do MySQL; as mesmas ideias gerais se aplicam a quase todas as aplicações.

Ao executar o MySQL, siga estas diretrizes:

* **Nunca dê acesso a ninguém (exceto contas `root` do MySQL) à tabela `user` no banco de dados `mysql`!** Isso é crucial.

* Aprenda como o sistema de privilégios de acesso do MySQL funciona (veja a Seção 8.2, “Controle de Acesso e Gerenciamento de Contas”). Use as instruções `GRANT` e `REVOKE` para controlar o acesso ao MySQL. Não conceda privilégios além do necessário. Nunca conceda privilégios a todos os hosts.

  Lista de verificação:

  + Tente `mysql -u root`. Se você conseguir se conectar com sucesso ao servidor sem ser solicitado uma senha, qualquer pessoa pode se conectar ao seu servidor MySQL como o usuário `root` do MySQL com privilégios completos! Revise as instruções de instalação do MySQL, prestando atenção especial às informações sobre a configuração de uma senha `root`. Veja a Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

+ Use a instrução `SHOW GRANTS` para verificar quais contas têm acesso a quais recursos. Em seguida, use a instrução `REVOKE` para remover os privilégios que não são necessários.

* Não armazene senhas em texto claro em seu banco de dados. Se o seu computador for comprometido, o invasor pode obter a lista completa das senhas e usá-las. Em vez disso, use `SHA2()` ou outra função de hashing unidirecional e armazene o valor do hash.

  Para evitar a recuperação de senhas usando tabelas de arco-íris, não use essas funções com uma senha simples; em vez disso, escolha uma string para ser usada como um sal e use os valores de hash(hash(senha)+sal).

* Considere que todas as senhas serão submetidas a tentativas automatizadas de quebra usando listas de senhas conhecidas, além de tentativas de adivinhação direcionadas usando informações publicamente disponíveis sobre você, como postagens em redes sociais. Não escolha senhas que consistem em itens facilmente quebrados ou adivinhados, como uma palavra do dicionário, nome próprio, nome de uma equipe esportiva, acrônimo ou frase comumente conhecida, especialmente se forem relevantes para você. O uso de letras maiúsculas, substituições e adições de números e caracteres especiais não ajuda se forem usados de maneiras previsíveis. Além disso, não escolha nenhuma senha que você tenha visto sendo usada como exemplo em qualquer lugar, ou uma variação dela, mesmo que tenha sido apresentada como um exemplo de senha forte.

Em vez disso, escolha senhas que sejam tão longas e imprevisíveis quanto possível. Isso não significa que a combinação precisa ser uma string aleatória de caracteres que seja difícil de lembrar e reproduzir, embora essa seja uma boa abordagem se você tiver, por exemplo, um software de gerenciamento de senhas que possa gerar e preencher essas senhas e armazená-las com segurança. Uma frase de senha que contenha várias palavras é fácil de criar, lembrar e reproduzir e é muito mais segura do que uma senha típica selecionada pelo usuário, consistindo em uma única palavra modificada ou uma sequência previsível de caracteres. Para criar uma frase de senha segura, certifique-se de que as palavras e outros itens nela não sejam uma frase ou citação conhecida, não ocorram em uma ordem previsível e, de preferência, não tenham nenhuma relação prévia entre si.

* Invista em um firewall. Isso o protege de pelo menos 50% de todos os tipos de explítulas em qualquer software. Coloque o MySQL atrás do firewall ou em uma zona demilitarizada (DMZ).

  Lista de verificação:

  + Tente escanear suas portas da Internet usando uma ferramenta como `nmap`. O MySQL usa a porta 3306 por padrão. Essa porta não deve ser acessível de hosts não confiáveis. Como uma maneira simples de verificar se sua porta MySQL está aberta, tente o seguinte comando de uma máquina remota, onde *`server_host`* é o nome do host ou endereço IP do host em que seu servidor MySQL está rodando:

    ```
    $> telnet server_host 3306
    ```

    Se o **telnet** ficar parado ou a conexão for recusada, a porta está bloqueada, o que é como você quer que seja. Se você receber uma conexão e alguns caracteres inúteis, a porta está aberta e deve ser fechada no seu firewall ou roteador, a menos que você realmente tenha uma boa razão para mantê-la aberta.

* As aplicações que acessam o MySQL não devem confiar em nenhum dado inserido pelos usuários e devem ser escritas usando técnicas adequadas de programação defensiva. Veja a Seção 8.1.7, “Diretrizes de Segurança para Programação do Cliente”.

* Não transmita dados simples (não criptografados) pela Internet. Essas informações são acessíveis a qualquer pessoa que tenha tempo e capacidade para interceptá-las e usá-las para seus próprios fins. Em vez disso, use um protocolo criptografado, como SSL ou SSH. O MySQL suporta conexões SSL internas. Outra técnica é usar o encaminhamento de porta SSH para criar um túnel criptografado (e compactado) para a comunicação.

* Aprenda a usar os utilitários **tcpdump** e **strings**. Na maioria dos casos, você pode verificar se os fluxos de dados do MySQL estão não criptografados emitindo um comando como o seguinte:

  ```
  $> tcpdump -l -i eth0 -w - src or dst port 3306 | strings
  ```

  Isso funciona no Linux e deve funcionar com pequenas modificações em outros sistemas.

* Aviso

* Se você não ver dados em texto claro, isso nem sempre significa que as informações realmente estão criptografadas. Se você precisar de alta segurança, consulte um especialista em segurança.