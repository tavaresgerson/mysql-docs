## 9.6 Manutenção e Recuperação após Falha de Tabelas MyISAM

Esta seção discute como usar o `myisamchk` para verificar ou reparar tabelas `MyISAM` (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenar dados e índices). Para informações gerais sobre o `myisamchk`, consulte a Seção 6.6.4, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”. Outras informações sobre reparo de tabelas podem ser encontradas na Seção 3.14, “Reestruturação ou Reparo de Tabelas ou Índices”.

Você pode usar o `myisamchk` para verificar, reparar ou otimizar tabelas de banco de dados. As seções a seguir descrevem como realizar essas operações e como configurar um cronograma de manutenção de tabelas. Para informações sobre como usar o `myisamchk` para obter informações sobre suas tabelas, consulte a Seção 6.6.4.5, “Obtendo Informações de Tabelas com o myisamchk”.

Embora a reparação de tabelas com o `myisamchk` seja bastante segura, é sempre uma boa ideia fazer um backup *antes* de realizar uma reparação ou qualquer operação de manutenção que possa fazer muitas alterações em uma tabela.

As operações do `myisamchk` que afetam índices podem fazer com que os índices `FULLTEXT` do `MyISAM` sejam reconstruídos com parâmetros de full-text incompatíveis com os valores usados pelo servidor MySQL. Para evitar esse problema, siga as diretrizes na Seção 6.6.4.1, “Opções Gerais do myisamchk”.

A manutenção de tabelas `MyISAM` também pode ser feita usando as instruções SQL que realizam operações semelhantes às que o `myisamchk` pode fazer:

* Para verificar tabelas `MyISAM`, use `CHECK TABLE`.
* Para reparar tabelas `MyISAM`, use `REPAIR TABLE`.
* Para otimizar tabelas `MyISAM`, use `OPTIMIZE TABLE`.
* Para analisar tabelas `MyISAM`, use `ANALYZE TABLE`.

Para informações adicionais sobre essas instruções, consulte a Seção 15.7.3, “Instruções de Manutenção de Tabelas”.

Essas declarações podem ser usadas diretamente ou por meio do programa cliente `mysqlcheck`. Uma vantagem dessas declarações em relação ao `myisamchk` é que o servidor faz todo o trabalho. Com o `myisamchk`, você deve garantir que o servidor não use as tabelas ao mesmo tempo, para que não haja interação indesejada entre o `myisamchk` e o servidor.