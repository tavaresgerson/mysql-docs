## 23.2 Uso de Rotinas Armazenadas

23.2.1 Sintaxe de rotina armazenada

23.2.2 Rotinas Armazenadas e Privilégios do MySQL

23.2.3 Metadados de rotina armazenados

23.2.4 Procedimentos Armazenados, Funções, Descodificadores e LAST_INSERT_ID()

O MySQL suporta rotinas armazenadas (procedimentos e funções). Uma rotina armazenada é um conjunto de instruções SQL que podem ser armazenadas no servidor. Uma vez feito isso, os clientes não precisam emitir as instruções individuais novamente, mas podem se referir à rotina armazenada.

Rotinas armazenadas exigem a tabela `proc` no banco de dados `mysql`. Essa tabela é criada durante o procedimento de instalação do MySQL. Se você estiver atualizando para o MySQL 5.7 a partir de uma versão anterior, certifique-se de atualizar suas tabelas de concessão para garantir que a tabela `proc` exista. Veja a Seção 4.4.7, “mysql_upgrade — Verificar e atualizar tabelas do MySQL”.

As rotinas armazenadas podem ser particularmente úteis em certas situações:

- Quando várias aplicações de clientes são escritas em diferentes idiomas ou funcionam em diferentes plataformas, mas precisam realizar as mesmas operações de banco de dados.

- Quando a segurança é primordial. Os bancos, por exemplo, usam procedimentos e funções armazenadas para todas as operações comuns. Isso proporciona um ambiente consistente e seguro, e as rotinas podem garantir que cada operação seja corretamente registrada. Nesse tipo de configuração, os aplicativos e os usuários não teriam acesso direto às tabelas do banco de dados, mas apenas poderiam executar rotinas armazenadas específicas.

As rotinas armazenadas podem proporcionar um desempenho melhor, pois é necessário enviar menos informações entre o servidor e o cliente. O desvantagem é que isso aumenta a carga no servidor de banco de dados, pois mais trabalho é feito no lado do servidor e menos é feito no lado do cliente (aplicativo). Considere isso se muitas máquinas cliente (como servidores Web) forem atendidas por apenas um ou alguns servidores de banco de dados.

As rotinas armazenadas também permitem que você tenha bibliotecas de funções no servidor de banco de dados. Essa é uma característica compartilhada por linguagens de aplicativos modernas que permitem esse design internamente (por exemplo, usando classes). Usar essas características da linguagem do aplicativo cliente é benéfico para o programador, mesmo fora do escopo do uso do banco de dados.

O MySQL segue a sintaxe SQL:2003 para rotinas armazenadas, que também é usada pelo DB2 da IBM. Todas as sintaxes descritas aqui são suportadas e quaisquer limitações e extensões são documentadas quando apropriado.

### Recursos adicionais

- Você pode achar útil o [Fórum de Usuários de Procedimentos Armazenados](https://forums.mysql.com/list.php?98) ao trabalhar com procedimentos e funções armazenadas.

- Para respostas a algumas perguntas frequentes sobre rotinas armazenadas no MySQL, consulte a Seção A.4, “Perguntas Frequentes do MySQL 5.7: Procedimentos e Funções Armazenadas”.

- Há algumas restrições sobre o uso de rotinas armazenadas. Veja a Seção 23.8, “Restrições sobre Programas Armazenados”.

- O registro binário para rotinas armazenadas ocorre conforme descrito na Seção 23.7, “Registro Binário de Programas Armazenados”.
