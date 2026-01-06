### 6.1.1 Diretrizes de Segurança

Quem estiver usando o MySQL em um computador conectado à Internet deve ler esta seção para evitar os erros de segurança mais comuns.

Ao discutir segurança, é necessário considerar a proteção completa de todo o servidor hospedeiro (não apenas o servidor MySQL) contra todos os tipos de ataques aplicáveis: escuta, alteração, reprodução e negação de serviço. Não abordamos todos os aspectos de disponibilidade e tolerância a falhas aqui.

O MySQL utiliza a segurança com base em Listas de Controle de Acesso (ACLs) para todas as conexões, consultas e outras operações que os usuários podem tentar realizar. Há também suporte para conexões criptografadas com SSL entre clientes e servidores do MySQL. Muitos dos conceitos discutidos aqui não são específicos do MySQL; as mesmas ideias gerais se aplicam a quase todas as aplicações.

Ao executar o MySQL, siga estas diretrizes:

- **Nunca dê acesso a ninguém (exceto contas `root` do MySQL) à tabela `user` no banco de dados do sistema `mysql`!** Isso é crucial.

- Saiba como o sistema de privilégios de acesso do MySQL funciona (consulte Seção 6.2, “Controle de Acesso e Gerenciamento de Contas”). Use as instruções `GRANT` e `REVOKE` para controlar o acesso ao MySQL. Não conceda mais privilégios do que o necessário. Nunca conceda privilégios a todos os hosts.

  Lista de verificação:

  - Tente `mysql -u root`. Se você conseguir se conectar ao servidor sem ser solicitado uma senha, qualquer pessoa pode se conectar ao seu servidor MySQL como o usuário `root` do MySQL com privilégios completos! Revise as instruções de instalação do MySQL, prestando atenção especial às informações sobre a definição de uma senha para o `root`. Veja Seção 2.9.4, “Segurança da Conta Inicial do MySQL”.

  - Use a declaração `SHOW GRANTS` para verificar quais contas têm acesso a quais recursos. Em seguida, use a declaração `REVOKE` para remover os privilégios que não são necessários.

- Não armazene senhas em texto claro em seu banco de dados. Se o seu computador for comprometido, o invasor pode obter a lista completa das senhas e usá-las. Em vez disso, use [`SHA2()`](https://pt.wikipedia.org/wiki/SHA-2) ou outra função de hash unidirecional e armazene o valor do hash.

  Para evitar a recuperação da senha usando tabelas de arco-íris, não use essas funções com uma senha simples; em vez disso, escolha uma string para ser usada como sal e use os valores hash(hash(senha) + sal).

- Suponha que todas as senhas sejam alvo de tentativas automatizadas de quebra usando listas de senhas conhecidas, além de tentativas direcionadas de adivinhação usando informações publicamente disponíveis sobre você, como postagens nas redes sociais. Não escolha senhas que sejam facilmente quebradas ou adivinhadas, como palavras de um dicionário, nomes próprios, nomes de equipes esportivas, siglas ou frases comumente conhecidas, especialmente se forem relevantes para você. O uso de letras maiúsculas, substituições e adições de números e caracteres especiais não ajuda se forem usados de maneiras previsíveis. Além disso, não escolha nenhuma senha que tenha sido usada como exemplo em algum lugar, ou uma variação dela, mesmo que tenha sido apresentada como um exemplo de senha forte.

  Em vez disso, escolha senhas que sejam tão longas e imprevisíveis quanto possível. Isso não significa que a combinação precisa ser uma string aleatória de caracteres difícil de lembrar e reproduzir, embora essa seja uma boa abordagem se você tiver, por exemplo, um software de gerenciador de senhas que possa gerar e preencher essas senhas e armazená-las com segurança. Uma frase de senha que contenha várias palavras é fácil de criar, lembrar e reproduzir e é muito mais segura do que uma senha típica selecionada pelo usuário, composta por uma única palavra modificada ou uma sequência previsível de caracteres. Para criar uma frase de senha segura, certifique-se de que as palavras e outros itens nela não sejam uma frase ou citação conhecida, não ocorram em uma ordem previsível e, de preferência, não tenham nenhuma relação anterior entre si.

- Invista em um firewall. Isso o protege contra pelo menos 50% de todos os tipos de exploração em qualquer software. Coloque o MySQL atrás do firewall ou em uma zona desmilitarizada (DMZ).

  Lista de verificação:

  - Tente escanear seus ports da Internet usando uma ferramenta como o `nmap`. O MySQL usa a porta 3306 por padrão. Essa porta não deve ser acessível a hosts não confiáveis. Como uma maneira simples de verificar se sua porta MySQL está aberta, tente o seguinte comando a partir de uma máquina remota, onde *`server_host`* é o nome do host ou o endereço IP do host em que seu servidor MySQL está rodando:

    ```sql
    $> telnet server_host 3306
    ```

    Se o **telnet** ficar parado ou a conexão for recusada, o porto está bloqueado, o que é o que você quer. Se você conseguir uma conexão e alguns caracteres inúteis, o porto está aberto e deve ser fechado no seu firewall ou roteador, a menos que você realmente tenha uma boa razão para mantê-lo aberto.

- As aplicações que acessam o MySQL não devem confiar em nenhum dado inserido pelos usuários e devem ser escritas usando técnicas de programação defensiva adequadas. Consulte Seção 6.1.7, “Diretrizes de Segurança para Programação de Clientes”.

- Não transmita dados simples (não criptografados) pela Internet. Essas informações são acessíveis a qualquer pessoa que tenha tempo e capacidade para interceptá-las e usá-las para seus próprios fins. Em vez disso, use um protocolo criptografado, como SSL ou SSH. O MySQL suporta conexões SSL internas. Outra técnica é usar o encaminhamento de porta SSH para criar um túnel criptografado (e compactado) para a comunicação.

- Aprenda a usar os utilitários **tcpdump** e **strings**. Na maioria dos casos, você pode verificar se os fluxos de dados do MySQL estão não criptografados emitindo um comando como o seguinte:

  ```sql
  $> tcpdump -l -i eth0 -w - src or dst port 3306 | strings
  ```

  Isso funciona no Linux e deve funcionar com pequenas modificações em outros sistemas.

  Aviso

  Se você não ver dados em texto claro, isso nem sempre significa que as informações estão realmente criptografadas. Se você precisar de alta segurança, consulte um especialista em segurança.
