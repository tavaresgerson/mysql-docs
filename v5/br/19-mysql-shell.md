# Capítulo 18 MySQL Shell

O MySQL Shell é um cliente avançado e um editor de código para o MySQL Server. Além da funcionalidade SQL fornecida, semelhante ao **mysql**, o MySQL Shell oferece recursos de script para JavaScript e Python e inclui APIs para trabalhar com o MySQL. O MySQL Shell é um componente que pode ser instalado separadamente.

A discussão a seguir descreve brevemente os recursos do MySQL Shell. Para mais informações, consulte o manual do MySQL Shell, disponível em https://dev.mysql.com/doc/mysql-shell/en/.

O MySQL Shell inclui as seguintes APIs implementadas em JavaScript e Python, que você pode usar para desenvolver código que interage com o MySQL.

* O X DevAPI permite que os desenvolvedores trabalhem com dados relacionais e de documentos quando o MySQL Shell está conectado a um servidor MySQL usando o X Protocol. Isso permite que você use o MySQL como um Document Store, às vezes referido como "usar NoSQL". Para mais informações, consulte o Capítulo 19, *Usando o MySQL como um Document Store*. Para documentação sobre os conceitos e uso do X DevAPI, que é implementado no MySQL Shell, consulte o Guia do Usuário do X DevAPI (X DevAPI User Guide).

* O AdminAPI permite que os administradores de Database trabalhem com o InnoDB Cluster, que fornece uma solução integrada para alta disponibilidade e escalabilidade usando databases MySQL baseados em InnoDB, sem exigir expertise avançada em MySQL. O AdminAPI também inclui suporte para o InnoDB ReplicaSet, que permite administrar um conjunto de instâncias MySQL executando replicação assíncrona baseada em GTID de maneira semelhante ao InnoDB Cluster. Além disso, o AdminAPI facilita a administração do MySQL Router, incluindo integração com o InnoDB Cluster e o InnoDB ReplicaSet. Consulte o AdminAPI do MySQL (MySQL AdminAPI).

O MySQL Shell está disponível em duas edições: a Community Edition e a Commercial Edition. A Community Edition está disponível gratuitamente. A Commercial Edition oferece recursos Enterprise adicionais a baixo custo.
