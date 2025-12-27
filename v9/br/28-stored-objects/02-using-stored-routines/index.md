## 27.2 Routines Armazenadas

27.2.1 Sintaxe das Routines Armazenadas

27.2.2 Routines Armazenadas e Privilegios do MySQL

27.2.3 Metadados das Routines Armazenadas

27.2.4 Procedimentos Armazenados, Funções, Triggers e LAST_INSERT_ID()

O MySQL suporta rotinas armazenadas (procedimentos e funções). Uma rotina armazenada é um conjunto de instruções SQL que podem ser armazenadas no servidor. Uma vez que isso é feito, os clientes não precisam emitir as instruções individuais novamente, mas podem referenciar a rotina armazenada.

As rotinas armazenadas podem ser particularmente úteis em certas situações:

* Quando múltiplas aplicações de clientes são escritas em diferentes linguagens ou trabalham em diferentes plataformas, mas precisam realizar as mesmas operações de banco de dados.

* Quando a segurança é primordial. Bancos, por exemplo, usam procedimentos e funções armazenadas para todas as operações comuns. Isso fornece um ambiente consistente e seguro, e as rotinas podem garantir que cada operação seja corretamente registrada. Nesse tipo de configuração, as aplicações e os usuários não teriam acesso direto às tabelas do banco de dados, mas podem apenas executar rotinas armazenadas específicas.

As rotinas armazenadas podem proporcionar um desempenho melhor porque menos informações precisam ser enviadas entre o servidor e o cliente. O sacrifício é que isso aumenta a carga no servidor do banco de dados, pois mais trabalho é feito no lado do servidor e menos é feito no lado do cliente (aplicação). Considere isso se muitas máquinas de clientes (como servidores Web) forem atendidas por apenas um ou alguns servidores de banco de dados.

As rotinas armazenadas também permitem que você tenha bibliotecas de funções no servidor de banco de dados. Esse é um recurso compartilhado por linguagens de aplicativos modernas que permitem esse design internamente (por exemplo, usando classes). Usar esses recursos de linguagens de aplicativos cliente é benéfico para o programador, mesmo fora do escopo do uso do banco de dados.

O MySQL segue a sintaxe SQL:2003 para rotinas armazenadas, que também é usada pelo IBM DB2. Toda a sintaxe descrita aqui é suportada e quaisquer limitações e extensões são documentadas quando apropriado.

### Recursos Adicionais

[Fórum de Usuários de Procedimentos Armazenados](https://forums.mysql.com/list.php?98) para uso ao trabalhar com procedimentos armazenados e funções.

* Para respostas a algumas perguntas comumente feitas sobre rotinas armazenadas no MySQL, consulte a Seção A.4, “MySQL 9.5 FAQ: Procedimentos Armazenados e Funções”.

* Existem algumas restrições sobre o uso de rotinas armazenadas. Veja a Seção 27.10, “Restrições em Programas Armazenados”.

* O registro binário para rotinas armazenadas ocorre conforme descrito na Seção 27.9, “Registro Binário de Programas Armazenados”.