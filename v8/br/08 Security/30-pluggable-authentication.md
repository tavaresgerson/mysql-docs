### 8.2.17 Autenticação Conectada

Quando um cliente se conecta ao servidor MySQL, o servidor usa o nome de usuário fornecido pelo cliente e o host do cliente para selecionar a linha de conta apropriada da tabela `mysql.user` do sistema. O servidor, então, autentica o cliente, determinando, a partir da linha de conta, qual plugin de autenticação se aplica ao cliente:

* Se o servidor não conseguir encontrar o plugin, ocorre um erro e a tentativa de conexão é rejeitada.
* Caso contrário, o servidor invoca esse plugin para autenticar o usuário, e o plugin retorna um status ao servidor indicando se o usuário forneceu a senha correta e se está autorizado a se conectar.

A autenticação conectada permite essas capacidades importantes:

* **Escolha dos métodos de autenticação.** A autenticação conectada facilita para os administradores de banco de dados escolher e alterar o método de autenticação usado para contas individuais do MySQL.
* **Autenticação externa.** A autenticação conectada permite que os clientes se conectem ao servidor MySQL com credenciais apropriadas para métodos de autenticação que armazenam credenciais em outros locais além da tabela `mysql.user` do sistema. Por exemplo, plugins podem ser criados para usar métodos de autenticação externa, como PAM, IDs de login do Windows, LDAP ou Kerberos.
* **Usuários proxy:** Se um usuário estiver autorizado a se conectar, um plugin de autenticação pode retornar ao servidor um nome de usuário diferente do nome do usuário que está se conectando, para indicar que o usuário que está se conectando é um proxy para outro usuário (o usuário proxy). Enquanto a conexão durar, o usuário proxy é tratado, para fins de controle de acesso, como tendo os privilégios do usuário proxy. Na verdade, um usuário assume a identidade de outro. Para mais informações, consulte a Seção 8.2.19, “Usuários Proxy”.

::: info Nota
Note

Se você iniciar o servidor com a opção `--skip-grant-tables`, os plugins de autenticação não serão usados, mesmo que sejam carregados, porque o servidor não realiza autenticação de cliente e permite que qualquer cliente se conecte. Como isso é inseguro, se o servidor for iniciado com a opção `--skip-grant-tables`, ele também desabilita as conexões remotas ao habilitar `skip_networking`.

:::

*  Plugins de Autenticação Disponíveis
*  O Plugin de Autenticação Padrão
*  Uso do Plugin de Autenticação
*  Compatibilidade do Plugin de Autenticação Cliente/Servidor
*  Considerações para a Escrita de Conectores do Plugin de Autenticação
*  Restrições sobre a Autenticação Plugável

#### Plugins de Autenticação Disponíveis

O MySQL 8.4 fornece esses plugins de autenticação:

* Um plugin que realiza autenticação nativa; ou seja, autenticação baseada no método de hash de senha em uso antes da introdução da autenticação plugável no MySQL. O plugin `mysql_native_password` implementa a autenticação com base nesse método nativo de hash de senha. Veja a Seção 8.4.1.1, “Autenticação Plugável Nativa”.

  ::: info Nota

  O plugin de autenticação `mysql_native_password` é desatualizado e está sujeito à remoção em uma versão futura do MySQL.

  :::

* Plugins que realizam autenticação usando hashing de senha SHA-256. Esse é um tipo de criptografia mais forte do que a disponível com a autenticação nativa. Veja a Seção 8.4.1.2, “Autenticação Plugavel SHA-2”, e a Seção 8.4.1.3, “Autenticação Plugavel SHA-256”.
* Um plugin do lado do cliente que envia a senha para o servidor sem hashing ou criptografia. Esse plugin é usado em conjunto com plugins do lado do servidor que exigem acesso à senha exatamente como fornecida pelo usuário cliente. Veja a Seção 8.4.1.4, “Autenticação Plugavel de Texto Claro do Lado do Cliente”.
* Um plugin que realiza autenticação externa usando PAM (Módulos de Autenticação Plugavel), permitindo que o MySQL Server use o PAM para autenticar usuários do MySQL. Esse plugin também suporta usuários proxy. Veja a Seção 8.4.1.5, “Autenticação Plugavel PAM”.
* Um plugin que realiza autenticação externa no Windows, permitindo que o MySQL Server use serviços nativos do Windows para autenticar conexões do cliente. Usuários que se cadastraram no Windows podem se conectar a partir de programas clientes do MySQL ao servidor com base nas informações em seu ambiente sem especificar uma senha adicional. Esse plugin também suporta usuários proxy. Veja a Seção 8.4.1.6, “Autenticação Plugavel Windows”.
* Plugins que realizam autenticação usando o LDAP (Protocolo Leve de Acesso a Diretórios) para autenticar usuários do MySQL acessando serviços de diretório como X.500. Esses plugins também suportam usuários proxy. Veja a Seção 8.4.1.7, “Autenticação Plugavel LDAP”.
* Um plugin que realiza autenticação usando Kerberos para autenticar usuários do MySQL que correspondem a princípios Kerberos. Veja a Seção 8.4.1.8, “Autenticação Plugavel Kerberos”.
* Um plugin que impede todas as conexões do cliente a qualquer conta que o use. Casos de uso para este plugin incluem contas proxy que nunca devem permitir login direto, mas são acessadas apenas por meio de contas proxy e contas que devem ser capazes de executar programas e visualizações armazenados com privilégios elevados sem expor esses privilégios a usuários comuns. Veja a Seção 8.4.1.9, “Autenticação Plugavel sem Login”.
* Um plugin que autentica clientes que se conectam do host local através do arquivo de socket Unix. Veja a Seção 8.4.1.10, “Autenticação Plugavel de Credenciais Peer-Socket”.
* Um plugin que autentica usuários no MySQL Server usando o formato WebAuthn com um dispositivo FIDO/FIDO2. Veja a Seção 8.4.1.11, “Autenticação Plugavel WebAuthn”.
* Um plugin de teste que verifica as credenciais da conta e registra o sucesso ou falha no log de erro do servidor. Esse plugin é destinado a fins de teste e desenvolvimento, e como exemplo de como escrever um plugin de autenticação. Veja a Seção 8.4.1.12, “Autenticação Plugavel de Teste”.

::: info Nota

Para obter informações sobre as restrições atuais sobre o uso de autenticação plugável, incluindo quais conectores suportam quais plugins, consulte Restrições sobre Autenticação Plugável.

Os desenvolvedores de conectores de terceiros devem ler essa seção para determinar em que medida um conector pode aproveitar as capacidades de autenticação plugável e quais etapas devem ser tomadas para se tornar mais conformes.

:::

Se você estiver interessado em escrever seus próprios plugins de autenticação, consulte Escrever Plugins de Autenticação.

#### O Plugin de Autenticação Padrão

As instruções `CREATE USER` e `ALTER USER` têm sintaxe para especificar como uma conta autentica. Algumas formas dessa sintaxe não nomeiam explicitamente um plugin de autenticação (não há cláusula `IDENTIFIED WITH`). Por exemplo:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

Nesses casos, o servidor atribui o plugin de autenticação padrão à conta. O MySQL 8.4 suporta autenticação multifator e até três cláusulas que especificam como uma conta autentica. As regras que determinam o plugin de autenticação padrão para métodos de autenticação que não nomeiam nenhum plugin são específicas do fator:

* Fator 1: Se o elemento `authentication_policy` 1 nomear um plugin de autenticação, esse plugin é o padrão. Se `authentication_policy` elemento 1 for `*`, `caching_sha2_password` é o padrão.

Dadas as regras acima, a seguinte instrução cria uma conta de autenticação de dois fatores, com o método de autenticação do primeiro fator determinado por `authentication_policy`, conforme mostrado aqui:

```
  CREATE USER 'wei'@'localhost' IDENTIFIED BY 'password'
    AND IDENTIFIED WITH authentication_ldap_simple;
  ```

Da mesma forma, este exemplo cria uma conta de autenticação de três fatores:

```
  CREATE USER 'mateo'@'localhost' IDENTIFIED BY 'password'
    AND IDENTIFIED WITH authentication_ldap_simple
    AND IDENTIFIED WITH authentication_fido;
  ```

Você pode usar `SHOW CREATE USER` para visualizar os métodos de autenticação aplicados.
* Fator 2 ou 3: Se o elemento `authentication_policy` correspondente nomear um plugin de autenticação, esse plugin é o padrão. Se o elemento `authentication_policy` for `*` ou vazio, não há padrão; tentar definir um método de autenticação de conta para o fator sem nomear um plugin é um erro, como nos exemplos seguintes:

  ```
  mysql> CREATE USER 'sofia'@'localhost' IDENTIFIED WITH authentication_ldap_simple
         AND IDENTIFIED BY 'abc';
  ERROR 1524 (HY000): Plugin '' is not loaded

  mysql> CREATE USER 'sofia'@'localhost' IDENTIFIED WITH authentication_ldap_simple
         AND IDENTIFIED BY 'abc';
  ERROR 1524 (HY000): Plugin '*' is not loaded
  ```

#### Uso de Plugins de Autenticação

Esta seção fornece instruções gerais para instalar e usar plugins de autenticação. Para instruções específicas de um plugin dado, consulte a seção que descreve esse plugin na Seção 8.4.1, “Plugins de Autenticação”.

Em geral, a autenticação plugável usa um par de plugins correspondentes nos lados do servidor e do cliente, então você usa um método de autenticação dado assim:

* Se necessário, instale a biblioteca de plugins ou bibliotecas contendo os plugins apropriados. No host do servidor, instale a biblioteca contendo o plugin do lado do servidor, para que o servidor possa usá-lo para autenticar conexões de cliente. Da mesma forma, em cada host do cliente, instale a biblioteca contendo o plugin do lado do cliente para uso por programas de cliente. Plugins de autenticação embutidos não precisam ser instalados.
* Para cada conta MySQL que você criar, especifique o plugin do lado do servidor apropriado para usar para autenticação. Se a conta usar o plugin de autenticação padrão, a declaração de criação da conta não precisa especificar o plugin explicitamente. O servidor atribui o plugin de autenticação padrão, determinado como descrito em O Plugin de Autenticação Padrão.
* Quando um cliente se conecta, o plugin do lado do servidor informa ao programa de cliente qual plugin do lado do cliente usar para autenticação.

No caso de uma conta usar um método de autenticação que seja o padrão tanto para o servidor quanto para o programa cliente, o servidor não precisa comunicar ao cliente qual plugin do lado do cliente deve ser usado, e uma negociação de ida e volta no cliente/servidor pode ser evitada.

Para clientes padrão MySQL, como `mysql` e `mysqladmin`, a opção `--default-auth=plugin_name` pode ser especificada na linha de comando como uma dica sobre qual plugin do lado do cliente o programa pode esperar usar, embora o servidor substitua isso se o plugin do lado do servidor associado à conta do usuário exigir um plugin do lado do cliente diferente.

Se o programa cliente não encontrar o arquivo da biblioteca do plugin do lado do cliente, especifique a opção `--plugin-dir=dir_name` para indicar a localização do diretório da biblioteca do plugin.

#### Compatibilidade de Plugins de Autenticação Cliente/Servidor

A autenticação plugável permite flexibilidade na escolha dos métodos de autenticação para contas MySQL, mas, em alguns casos, as conexões do cliente não podem ser estabelecidas devido à incompatibilidade do plugin de autenticação entre o cliente e o servidor.

O princípio geral de compatibilidade para uma conexão cliente bem-sucedida com uma conta em um servidor dado é que o cliente e o servidor devem suportar o *método* de autenticação exigido pela conta. Como os métodos de autenticação são implementados por plugins de autenticação, o cliente e o servidor devem suportar o *plugin* de autenticação exigido pela conta.

As incompatibilidades dos plugins de autenticação podem surgir de várias maneiras. Exemplos:

* Conecte-se usando um cliente MySQL 5.7 a partir de 5.7.22 ou versões inferiores a uma conta do servidor MySQL 8.4 que autentique com `caching_sha2_password`. Isso falha porque o cliente 5.7 não reconhece o plugin. (Esse problema é resolvido no MySQL 5.7 a partir de 5.7.23, quando o suporte do cliente `caching_sha2_password` foi adicionado à biblioteca do cliente MySQL e aos programas do cliente.)
* Conecte-se usando um cliente MySQL 5.7 a uma conta de servidor anterior a 5.7 que autentique com `mysql_old_password`. Isso falha por várias razões. Primeiro, uma conexão desse tipo requer `--secure-auth=0`, que não é mais uma opção suportada. Mesmo que fosse suportada, o cliente 5.7 não reconheceria o plugin porque ele foi removido no MySQL 5.7.
* Conecte-se usando um cliente MySQL 5.7 de uma distribuição comunitária a uma conta de servidor MySQL 5.7 Enterprise que autentique usando um dos plugins de autenticação LDAP exclusivos da Enterprise. Isso falha porque o cliente comunitário não tem acesso ao plugin Enterprise.

Em geral, esses problemas de compatibilidade não surgem quando as conexões são feitas entre um cliente e um servidor da mesma distribuição MySQL. Quando as conexões são feitas entre um cliente e um servidor de diferentes séries MySQL, problemas podem surgir. Esses problemas são inerentes ao processo de desenvolvimento quando o MySQL introduz novos plugins de autenticação ou remove os antigos. Para minimizar o potencial de incompatibilidades, atualize regularmente o servidor, os clientes e os conectores de forma oportuna.

#### Considerações sobre a Conexão do Plugin de Autenticação

Existem várias implementações do protocolo cliente/servidor MySQL. A biblioteca de clientes C API `libmysqlclient` é uma implementação. Alguns conectores MySQL (tipicamente aqueles não escritos em C) fornecem sua própria implementação. No entanto, nem todas as implementações do protocolo tratam a autenticação de plugins da mesma maneira. Esta seção descreve um problema de autenticação que os implementadores do protocolo devem levar em consideração.

No protocolo cliente/servidor, o servidor informa aos clientes conectados qual plugin de autenticação ele considera o padrão. Se a implementação do protocolo usada pelo cliente tentar carregar o plugin padrão e esse plugin não existir no lado do cliente, a operação de carregamento falha. Essa é uma falha desnecessária se o plugin padrão não for o plugin realmente necessário para a conta para a qual o cliente está tentando se conectar.

Se uma implementação de protocolo cliente/servidor não tiver sua própria noção de plugin de autenticação padrão e sempre tentar carregar o plugin padrão especificado pelo servidor, ela falhará com um erro se esse plugin não estiver disponível.

Para evitar esse problema, a implementação do protocolo usada pelo cliente deve ter seu próprio plugin padrão e deve usá-lo como sua primeira escolha (ou, como alternativa, recorrer a esse padrão em caso de falha no carregamento do plugin padrão especificado pelo servidor). Exemplo:

* No MySQL 5.7, o `libmysqlclient` usa como escolha padrão `mysql_native_password` ou o plugin especificado através da opção `MYSQL_DEFAULT_AUTH` para `mysql_options()`.
* Quando um cliente 5.7 tenta se conectar a um servidor 8.4, o servidor especifica `caching_sha2_password` como seu plugin de autenticação padrão, mas o cliente ainda envia detalhes de credenciais por `mysql_native_password` ou o que for especificado através de `MYSQL_DEFAULT_AUTH`.
* A única vez que o cliente carrega o plugin especificado pelo servidor é para uma solicitação de mudança de plugin, mas, nesse caso, pode ser qualquer plugin, dependendo da conta do usuário. Nesse caso, o cliente deve tentar carregar o plugin e, se esse plugin não estiver disponível, um erro não é opcional.

#### Restrições sobre Autenticação Plugável

A primeira parte desta seção descreve as restrições gerais sobre a aplicabilidade do framework de autenticação plugável descrito na Seção 8.2.17, “Autenticação Plugável”. A segunda parte descreve como os desenvolvedores de conectores de terceiros podem determinar em que medida um conector pode aproveitar as capacidades de autenticação plugável e quais são as etapas a serem seguidas para se tornar mais compatível.

O termo “autenticação nativa” usado aqui se refere à autenticação contra senhas armazenadas na tabela de sistema `mysql.user`. Esse é o mesmo método de autenticação fornecido por servidores MySQL mais antigos, antes que a autenticação plugável fosse implementada. “Autenticação nativa do Windows” refere-se à autenticação usando as credenciais de um usuário que já iniciou sessão no Windows, conforme implementado pelo plugin de Autenticação Nativa do Windows (“plugin do Windows” para abreviar).

* Restrições Gerais de Autenticação Plugável
* Autenticação Plugável e Conectores de Terceiros

##### Restrições Gerais de Autenticação Plugável

* **Connector/C++:** Clientes que usam este conector podem se conectar ao servidor apenas por meio de contas que usam autenticação nativa.

  Exceção: Um conector suporta autenticação plugável se foi construído para se vincular ao `libmysqlclient` dinamicamente (em vez de staticamente) e carrega a versão atual do `libmysqlclient` se essa versão estiver instalada, ou se o conector for recompilado a partir do código-fonte para vincular ao `libmysqlclient` atual.

Para obter informações sobre como escrever conectores para lidar com informações do servidor sobre o plugin de autenticação do lado do servidor padrão, consulte Considerações sobre Conectores de Plugin de Autenticação.
* **Connector/NET:** Clientes que usam o Connector/NET podem se conectar ao servidor por meio de contas que usam autenticação nativa ou autenticação nativa do Windows.
* **Connector/PHP:** Clientes que usam este conector podem se conectar ao servidor apenas por meio de contas que usam autenticação nativa, quando compilados usando o driver nativo MySQL para PHP (`mysqlnd`).
* **Autenticação nativa do Windows:** Conectar-se por meio de uma conta que usa o plugin do Windows requer a configuração do Domínio do Windows. Sem isso, a autenticação NTLM é usada e, então, apenas conexões locais são possíveis; ou seja, o cliente e o servidor devem estar no mesmo computador.
* **Usuários de proxy:** O suporte a usuários de proxy está disponível na medida em que os clientes podem se conectar por meio de contas autenticadas com plugins que implementam a capacidade de usuário proxy (ou seja, plugins que podem retornar um nome de usuário diferente do do usuário conectado). Por exemplo, os plugins PAM e do Windows suportam usuários proxy. Os plugins de autenticação `mysql_native_password` (desatualizado) e `sha256_password` (desatualizado) não suportam usuários proxy por padrão, mas podem ser configurados para fazer isso; consulte Suporte do servidor para mapeamento de usuário proxy.
* **Replicação**: As réplicas podem não apenas empregar contas de usuário de replicação usando autenticação nativa, mas também se conectar por meio de contas de usuário de replicação que usam autenticação não nativa se o plugin do lado do cliente necessário estiver disponível. Se o plugin for incorporado ao `libmysqlclient`, ele está disponível por padrão. Caso contrário, o plugin deve ser instalado no lado da réplica no diretório nomeado pela variável de sistema `plugin_dir` da réplica.
* **Tabelas `FEDERATED`**: Uma tabela `FEDERATED` pode acessar a tabela remota apenas por meio de contas no servidor remoto que usam autenticação nativa.

##### Conectores de Autenticação Conecláveis e Conectores de Terceiros

Os desenvolvedores de conectores de terceiros podem seguir as diretrizes a seguir para determinar a prontidão de um conector para aproveitar as capacidades de autenticação coneclável e quais etapas tomar para se tornar mais compatível:

* Um conector existente que não tenha sofrido alterações usa autenticação nativa e os clientes que usam o conector podem se conectar ao servidor apenas por meio de contas que usam autenticação nativa. *No entanto, você deve testar o conector contra uma versão recente do servidor para verificar se tais conexões ainda funcionam sem problemas.*

  Exceção: Um conector pode funcionar com autenticação coneclável sem nenhuma alteração se ele se conectar ao `libmysqlclient` dinamicamente (em vez de staticamente) e carregar a versão atual do `libmysqlclient` se essa versão estiver instalada.
* Para aproveitar as capacidades de autenticação coneclável, um conector baseado em `libmysqlclient` deve ser relinkado contra a versão atual do `libmysqlclient`. Isso permite que o conector suporte conexões por meio de contas que agora exigem plugins do lado do cliente construídos no `libmysqlclient` (como o plugin em texto claro necessário para a autenticação PAM e o plugin para Windows necessário para a autenticação nativa do Windows). A vinculação com um `libmysqlclient` atual também permite que o conector acesse plugins do lado do cliente instalados no diretório padrão do plugin MySQL (tipicamente o diretório nomeado pelo valor padrão da variável de sistema `plugin_dir` do servidor local).

Se um conector estiver vinculado dinamicamente a `libmysqlclient`, é necessário garantir que a versão mais recente de `libmysqlclient` esteja instalada no host do cliente e que o conector a carregue em tempo de execução.
* Outra maneira de um conector suportar um método de autenticação específico é implementá-lo diretamente no protocolo cliente/servidor. O Connector/NET utiliza essa abordagem para fornecer suporte à autenticação nativa do Windows.
* Se um conector deve ser capaz de carregar plugins do lado do cliente a partir de um diretório diferente do diretório padrão de plugins, é necessário implementar algum meio para que os usuários do cliente possam especificar o diretório. As possibilidades incluem uma opção de linha de comando ou uma variável de ambiente a partir da qual o conector pode obter o nome do diretório. Programas padrão de clientes MySQL, como `mysql` e `mysqladmin`, implementam uma opção `--plugin-dir`. Veja também a Interface de Plugin do Cliente da API C.
* O suporte a usuários proxy por um conector depende, conforme descrito anteriormente nesta seção, se os métodos de autenticação que ele suporta permitem usuários proxy.