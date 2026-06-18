## 7.6 Manutenção de tabelas MyISAM e recuperação após falhas

Esta seção discute como usar o **myisamchk** para verificar ou reparar as tabelas **MyISAM** (tabelas que possuem arquivos `.MYD` e `.MYI` para armazenar dados e índices). Para informações gerais sobre o **myisamchk**, consulte a Seção 4.6.3, “myisamchk — Ferramenta de Manutenção de Tabelas MyISAM”. Outras informações sobre reparo de tabelas podem ser encontradas na Seção 2.10.12, “Reestruturação ou reparo de tabelas ou índices”.

Você pode usar **myisamchk** para verificar, reparar ou otimizar as tabelas do banco de dados. As seções a seguir descrevem como realizar essas operações e como configurar um cronograma de manutenção de tabelas. Para obter informações sobre como usar **myisamchk** para obter informações sobre suas tabelas, consulte a Seção 4.6.3.5, “Obtendo Informações sobre as Tabelas com o myisamchk”.

Embora a reparação de tabelas com **myisamchk** seja bastante segura, é sempre uma boa ideia fazer um backup *antes* de realizar uma reparação ou qualquer operação de manutenção que possa causar muitas alterações em uma tabela.

As operações **myisamchk** que afetam índices podem fazer com que os índices `FULLTEXT` do `MyISAM` sejam reconstruídos com parâmetros de texto completo que são incompatíveis com os valores usados pelo servidor MySQL. Para evitar esse problema, siga as diretrizes na Seção 4.6.3.1, “Opções Gerais do myisamchk”.

A manutenção da tabela `MyISAM` também pode ser feita usando as instruções SQL que realizam operações semelhantes às que o **myisamchk** pode fazer:

- Para verificar as tabelas `MyISAM`, use `CHECK TABLE`.

- Para reparar as tabelas `MyISAM`, use `REPAIR TABLE`.

- Para otimizar as tabelas `MyISAM`, use `OPTIMIZE TABLE`.

- Para analisar tabelas `MyISAM`, use `ANALYZE TABLE`.

Para obter informações adicionais sobre essas declarações, consulte a Seção 13.7.2, “Declarações de Manutenção de Tabelas”.

Essas declarações podem ser usadas diretamente ou por meio do programa cliente **mysqlcheck**. Uma vantagem dessas declarações em relação ao **myisamchk** é que o servidor faz todo o trabalho. Com o **myisamchk**, você deve garantir que o servidor não use as tabelas ao mesmo tempo para evitar interações indesejadas entre o **myisamchk** e o servidor.
