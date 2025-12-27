#### 19.5.1.18 Replicação e Programas Armazenados em JavaScript

A Replicação do MySQL é compatível com programas armazenados em JavaScript, desde que o componente MLE esteja instalado em cada servidor da topologia, devido aos seguintes problemas:

* Uma replica sem o componente instalado aceita as instruções `CREATE FUNCTION` e `CREATE PROCEDURE` que contêm código JavaScript da fonte, mas a replica não pode executar os programas armazenados assim criados.
* Um programa armazenado em JavaScript criado em um servidor sem o componente instalado não é verificado quanto à validade.
* As seguintes instruções SQL não podem ser executadas com sucesso em uma replica que não tem o componente instalado:

  + `CREATE LIBRARY`
  + `DROP LIBRARY`
  + Uma instrução `CREATE FUNCTION` ou `CREATE PROCEDURE` que contenha uma cláusula `USING`

Em um servidor sem o componente MLE, cada uma das instruções mostradas é rejeitada com um erro de sintaxe.

Isso significa que, quando uma instrução `CREATE FUNCTION` ou `CREATE PROCEDURE` sem `USING`, e que contém código JavaScript inválido, é executada em um servidor sem o componente MLE instalado, a instrução é bem-sucedida e, portanto, é replicada. Se a replica tiver o componente MLE instalado, um erro é gerado quando a replica tenta executar tal instrução, levando a uma interrupção na replicação.

Além disso, quando `CREATE LIBRARY`, `DROP LIBRARY`, `CREATE FUNCTION ... USING` ou `CREATE PROCEDURE ... USING` é executado em um servidor sem o componente MLE instalado, a instrução é sempre rejeitada porque o servidor não suporta a sintaxe.

Para instalar (ou desinstalar) o componente MLE em servidores MySQL usados na replicação, recomenda-se que você pare a replicação, instale (ou desinstale) o componente em todos os servidores da topologia e, só então, permita que a replicação seja retomada. A replicação entre servidores em um ambiente misto (ou seja, em que alguns servidores têm o componente MLE instalado e outros não) não é suportada pelas razões mencionadas no parágrafo anterior.

Para obter mais informações sobre programas armazenados em JavaScript no MySQL, consulte a Seção 27.3, “Programas Armazenados em JavaScript”. Para informações sobre o componente MLE, consulte a Seção 7.5.7, “Componente do Motor Multilíngue (MLE”)”).