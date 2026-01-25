### 6.1.1 Diretrizes de Segurança

Qualquer pessoa usando MySQL em um computador conectado à Internet deve ler esta seção para evitar os erros de segurança mais comuns.

Ao discutir segurança, é necessário considerar a proteção total de todo o *server host* (e não apenas do servidor MySQL) contra todos os tipos de ataques aplicáveis: *eavesdropping* (escuta), alteração, *playback* (repetição) e *denial of service*. Não cobrimos todos os aspectos de disponibilidade e tolerância a falhas aqui.

O MySQL utiliza segurança baseada em Access Control Lists (ACLs) para todas as connections, Queries e outras operações que os usuários podem tentar executar. Há também suporte para connections criptografadas via SSL entre clientes e servidores MySQL. Muitos dos conceitos discutidos aqui não são específicos do MySQL; as mesmas ideias gerais se aplicam a quase todas as aplicações.

Ao executar o MySQL, siga estas diretrizes:

* **Nunca dê acesso a ninguém (exceto contas `root` do MySQL) à tabela `user` no Database de sistema `mysql`!** Isso é crítico.

* Aprenda como o sistema de privilégios de acesso do MySQL funciona (consulte [Section 6.2, “Access Control and Account Management”](access-control.html "6.2 Access Control and Account Management")). Use as Statements [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") para controlar o acesso ao MySQL. Não conceda mais privilégios do que o necessário. Nunca conceda privilégios a todos os hosts.

  Checklist:

  + Tente `mysql -u root`. Se você conseguir se conectar ao server com sucesso sem que uma senha seja solicitada, qualquer pessoa poderá se conectar ao seu servidor MySQL como o usuário `root` do MySQL com privilégios totais! Revise as instruções de instalação do MySQL, prestando atenção especial às informações sobre como definir uma senha `root`. Consulte [Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account").

  + Use a Statement [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") para verificar quais contas têm acesso a quê. Em seguida, use a Statement [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") para remover os privilégios desnecessários.

* Não armazene senhas em *cleartext* (texto simples) no seu Database. Se o seu computador for comprometido, o invasor poderá pegar a lista completa de senhas e usá-las. Em vez disso, use [`SHA2()`](encryption-functions.html#function_sha2) ou alguma outra função de *hashing* unidirecional (*one-way hashing function*) e armazene o valor do *hash*.

  Para evitar a recuperação de senhas usando *rainbow tables*, não use essas funções em uma senha simples; em vez disso, escolha alguma *string* para ser usada como *salt*, e use os valores hash(hash(password)+salt).

* Presuma que todas as senhas estarão sujeitas a tentativas automatizadas de quebra usando listas de senhas conhecidas e também a tentativas direcionadas de adivinhação usando informações publicamente disponíveis sobre você, como postagens em mídias sociais. Não escolha senhas que consistam em itens fáceis de quebrar ou adivinhar, como uma palavra de dicionário, nome próprio, nome de time esportivo, acrônimo ou frase comumente conhecida, principalmente se forem relevantes para você. O uso de letras maiúsculas, substituições e adições de números e caracteres especiais não ajuda se forem usados de maneiras previsíveis. Além disso, não escolha nenhuma senha que você tenha visto usada como exemplo em qualquer lugar, ou uma variação dela, mesmo que tenha sido apresentada como um exemplo de senha forte.

  Em vez disso, escolha senhas que sejam o mais longas e imprevisíveis possível. Isso não significa que a combinação precise ser uma *string* aleatória de caracteres difícil de lembrar e reproduzir, embora esta seja uma boa abordagem se você tiver, por exemplo, um software gerenciador de senhas que possa gerar e preencher essas senhas e armazená-las de forma segura. Uma *passphrase* contendo várias palavras é fácil de criar, lembrar e reproduzir, e é muito mais segura do que uma senha típica selecionada pelo usuário, que consiste em uma única palavra modificada ou uma sequência previsível de caracteres. Para criar uma *passphrase* segura, certifique-se de que as palavras e outros itens nela não sejam uma frase ou citação conhecida, não ocorram em uma ordem previsível e, de preferência, não tenham nenhuma relação prévia entre si.

* Invista em um *firewall*. Isso o protege de pelo menos 50% de todos os tipos de *exploits* em qualquer software. Coloque o MySQL atrás do *firewall* ou em uma *demilitarized zone* (DMZ).

  Checklist:

  + Tente escanear suas portas a partir da Internet usando uma ferramenta como `nmap`. O MySQL usa a porta 3306 por padrão. Esta porta não deve estar acessível a partir de hosts não confiáveis. Como uma maneira simples de verificar se sua porta MySQL está aberta, tente o seguinte comando a partir de alguma máquina remota, onde *`server_host`* é o nome do host ou o endereço IP do host no qual seu servidor MySQL está sendo executado:

    ```sql
    $> telnet server_host 3306
    ```

    Se o **telnet** travar ou a connection for recusada, a porta está bloqueada, que é o estado desejado. Se você conseguir uma connection e alguns caracteres estranhos (*garbage characters*), a porta está aberta e deve ser fechada no seu *firewall* ou *router*, a menos que você realmente tenha um bom motivo para mantê-la aberta.

* Aplicações que acessam o MySQL não devem confiar em nenhum dado inserido pelos usuários e devem ser escritas usando técnicas adequadas de programação defensiva. Consulte [Section 6.1.7, “Client Programming Security Guidelines”](secure-client-programming.html "6.1.7 Client Programming Security Guidelines").

* Não transmita dados simples (não criptografados) pela Internet. Essas informações são acessíveis a todos que têm tempo e capacidade de interceptá-las e usá-las para seus próprios propósitos. Em vez disso, use um protocolo criptografado como SSL ou SSH. O MySQL suporta connections SSL internas. Outra técnica é usar o *port-forwarding* SSH para criar um *tunnel* criptografado (e compactado) para a comunicação.

* Aprenda a usar as utilidades **tcpdump** e **strings**. Na maioria dos casos, você pode verificar se os fluxos de dados do MySQL não estão criptografados emitindo um comando como o seguinte:

  ```sql
  $> tcpdump -l -i eth0 -w - src or dst port 3306 | strings
  ```

  Isso funciona no Linux e deve funcionar com pequenas modificações em outros sistemas.

  Warning

  Se você não vir dados em *cleartext* (texto simples), isso nem sempre significa que a informação está realmente criptografada. Se você precisar de alta segurança, consulte um especialista em segurança.