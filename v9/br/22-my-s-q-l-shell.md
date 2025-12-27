# Capítulo 21 MySQL Shell

O MySQL Shell é um cliente e editor de código avançado para o MySQL Server. Além das funcionalidades SQL fornecidas, semelhante ao **mysql**, o MySQL Shell oferece capacidades de script para JavaScript e Python e inclui APIs para trabalhar com o MySQL. O MySQL Shell é um componente que você pode instalar separadamente.

A discussão a seguir descreve brevemente as capacidades do MySQL Shell. Para mais informações, consulte o manual do MySQL Shell, disponível em https://dev.mysql.com/doc/mysql-shell/pt/.

O MySQL Shell inclui as seguintes APIs implementadas em JavaScript e Python que você pode usar para desenvolver código que interage com o MySQL.

* A X DevAPI permite que os desenvolvedores trabalhem com dados relacionais e de documento quando o MySQL Shell está conectado a um servidor MySQL usando o Protocolo X. Isso permite que você use o MySQL como um Armazenamento de Documentos, às vezes referido como “uso de NoSQL”. Para mais informações, consulte o Capítulo 22, *Usando o MySQL como um Armazenamento de Documentos*. Para documentação sobre os conceitos e o uso da X DevAPI, que é implementada no MySQL Shell, consulte o Guia do Usuário da X DevAPI.

* A AdminAPI permite que os administradores de banco de dados trabalhem com o InnoDB Cluster, que fornece uma solução integrada para alta disponibilidade e escalabilidade usando bancos de dados MySQL baseados em InnoDB, sem exigir experiência avançada com o MySQL. A AdminAPI também inclui suporte para InnoDB ReplicaSet, que permite que você administre um conjunto de instâncias MySQL que executam replicação GTID assíncrona de maneira semelhante ao InnoDB Cluster. Além disso, a AdminAPI facilita a administração do MySQL Router, incluindo integração com o InnoDB Cluster e o InnoDB ReplicaSet. Veja MySQL AdminAPI.

O MySQL Shell está disponível em duas edições: a Edição Comunitária e a Edição Comercial. A Edição Comunitária está disponível gratuitamente. A Edição Comercial oferece recursos empresariais adicionais a um custo baixo.