# Prefácio e Avisos Legais

Este é o Manual de Referência para o Sistema de Database MySQL, versão 5.7, até o lançamento 5.7.44. As diferenças entre as versões menores do MySQL 5.7 são observadas no presente texto com referência aos números de lançamento (5.7.*`x`*). Para informações sobre licença, consulte os Avisos Legais.

Este manual não se destina a ser utilizado com versões mais antigas do software MySQL devido às muitas diferenças funcionais e outras entre o MySQL 5.7 e as versões anteriores. Se você estiver usando um lançamento anterior do software MySQL, consulte o manual apropriado. Por exemplo, o *MySQL 5.6 Reference Manual* abrange a série 5.6 de lançamentos do software MySQL.

Se você estiver usando o MySQL 8.0, consulte o *MySQL 8.0 Reference Manual*.

**Informações de Licenciamento—MySQL 5.7.** Este produto pode incluir software de terceiros, utilizado sob licença. Se você estiver usando um lançamento *Commercial* do MySQL 5.7, consulte o [MySQL 5.7 Commercial Release License Information User Manual](https://downloads.mysql.com/docs/licenses/mysqld-5.7-com-en.pdf) para obter informações de licenciamento, incluindo informações de licenciamento relacionadas a software de terceiros que possam estar incluídos neste lançamento Commercial. Se você estiver usando um lançamento *Community* do MySQL 5.7, consulte o [MySQL 5.7 Community Release License Information User Manual](https://downloads.mysql.com/docs/licenses/mysqld-5.7-gpl-en.pdf) para obter informações de licenciamento, incluindo informações de licenciamento relacionadas a software de terceiros que possam estar incluídos neste lançamento Community.

**Informações de Licenciamento—MySQL NDB Cluster 7.5.** Este produto pode incluir software de terceiros, utilizado sob licença. Se você estiver usando um lançamento *Commercial* do NDB Cluster 7.5, consulte o [MySQL NDB Cluster 7.5 Commercial Release License Information User Manual](https://downloads.mysql.com/docs/licenses/cluster-7.5-com-en.pdf) para obter informações de licenciamento relacionadas a software de terceiros que possam estar incluídos neste lançamento Commercial. Se você estiver usando um lançamento *Community* do NDB Cluster 7.5, consulte o [MySQL NDB Cluster 7.5 Community Release License Information User Manual](https://downloads.mysql.com/docs/licenses/cluster-7.5-gpl-en.pdf) para obter informações de licenciamento relacionadas a software de terceiros que possam estar incluídos neste lançamento Community.

**Informações de Licenciamento—MySQL NDB Cluster 7.6.** Se você estiver usando um lançamento *Commercial* do MySQL NDB Cluster 7.6, consulte o [MySQL NDB Cluster 7.6 Commercial Release License Information User Manual](https://downloads.mysql.com/docs/licenses/cluster-7.6-com-en.pdf) para obter informações de licenciamento, incluindo informações de licenciamento relacionadas a software de terceiros que possam estar incluídos neste lançamento Commercial. Se você estiver usando um lançamento *Community* do MySQL NDB Cluster 7.6, consulte o [MySQL NDB Cluster 7.6 Community Release License Information User Manual](https://downloads.mysql.com/docs/licenses/cluster-7.6-gpl-en.pdf) para obter informações de licenciamento, incluindo informações de licenciamento relacionadas a software de terceiros que possam estar incluídos neste lançamento Community.

## Avisos Legais

Copyright © 1997, 2025, Oracle e/ou suas afiliadas.

**Restrições de Licença**

Este software e documentação relacionada são fornecidos sob um contrato de licença contendo restrições de uso e divulgação e são protegidos por leis de propriedade intelectual. Exceto conforme expressamente permitido no seu contrato de licença ou permitido por lei, você não pode usar, copiar, reproduzir, traduzir, transmitir, modificar, licenciar, distribuir, exibir, executar, publicar ou mostrar qualquer parte, em qualquer forma ou por quaisquer meios. A engenharia reversa, desmontagem ou descompilação deste software, a menos que exigido por lei para interoperabilidade, é proibida.

**Isenção de Garantia**

As informações contidas neste documento estão sujeitas a alterações sem aviso prévio e não têm garantia de estarem livres de erros. Se você encontrar quaisquer erros, por favor, nos informe por escrito.

**Aviso de Direitos Restritos**

Se este for software, documentação de software, dados (conforme definido no Federal Acquisition Regulation) ou documentação relacionada que é entregue ao Governo dos EUA ou a qualquer pessoa que o esteja licenciando em nome do Governo dos EUA, o seguinte aviso é aplicável:

USUÁRIOS FINAIS DO GOVERNO DOS EUA: Programas Oracle (incluindo qualquer sistema operacional, software integrado, quaisquer programas incorporados, instalados ou ativados em hardware entregue e modificações de tais programas) e documentação de computador Oracle ou outros dados Oracle entregues ou acessados por usuários finais do Governo dos EUA são "software de computador comercial" (commercial computer software), "documentação de software de computador comercial" (commercial computer software documentation) ou "dados de direitos limitados" (limited rights data) de acordo com o Federal Acquisition Regulation e regulamentos suplementares específicos da agência aplicáveis. Como tal, o uso, reprodução, duplicação, lançamento, exibição, divulgação, modificação, preparação de trabalhos derivados e/ou adaptação de i) programas Oracle (incluindo qualquer sistema operacional, software integrado, quaisquer programas incorporados, instalados ou ativados em hardware entregue e modificações de tais programas), ii) documentação de computador Oracle e/ou iii) outros dados Oracle, está sujeito aos direitos e limitações especificados na licença contida no contrato aplicável. Os termos que regem o uso dos serviços de cloud da Oracle pelo Governo dos EUA são definidos pelo contrato aplicável para tais serviços. Nenhum outro direito é concedido ao Governo dos EUA.

**Aviso de Aplicações Perigosas**

Este software ou hardware é desenvolvido para uso geral em uma variedade de aplicações de gerenciamento de informações. Não é desenvolvido ou destinado para uso em quaisquer aplicações inerentemente perigosas, incluindo aplicações que possam criar um risco de lesão corporal. Se você usar este software ou hardware em aplicações perigosas, você será responsável por tomar todas as medidas apropriadas de segurança, backup, redundância e outras para garantir seu uso seguro. A Oracle Corporation e suas afiliadas se isentam de qualquer responsabilidade por quaisquer danos causados pelo uso deste software ou hardware em aplicações perigosas.

**Aviso de Marca Registrada**

Oracle, Java, MySQL e NetSuite são marcas registradas da Oracle e/ou suas afiliadas. Outros nomes podem ser marcas registradas de seus respectivos proprietários.

Intel e Intel Inside são marcas comerciais ou marcas registradas da Intel Corporation. Todas as marcas comerciais SPARC são usadas sob licença e são marcas comerciais ou marcas registradas da SPARC International, Inc. AMD, Epyc e o logotipo AMD são marcas comerciais ou marcas registradas da Advanced Micro Devices. UNIX é uma marca registrada de The Open Group.

**Isenção de Responsabilidade sobre Conteúdo, Produtos e Serviços de Terceiros**

Este software ou hardware e documentação podem fornecer acesso ou informações sobre conteúdo, produtos e serviços de terceiros. A Oracle Corporation e suas afiliadas não são responsáveis e expressamente se isentam de todas as garantias de qualquer tipo com relação a conteúdo, produtos e serviços de terceiros, a menos que especificado de outra forma em um acordo aplicável entre você e a Oracle. A Oracle Corporation e suas afiliadas não serão responsáveis por quaisquer perdas, custos ou danos incorridos devido ao seu acesso ou uso de conteúdo, produtos ou serviços de terceiros, exceto conforme estabelecido em um acordo aplicável entre você e a Oracle.

**Uso Desta Documentação**

Esta documentação NÃO é distribuída sob uma licença GPL. O uso desta documentação está sujeito aos seguintes termos:

Você pode criar uma cópia impressa desta documentação unicamente para seu uso pessoal. A conversão para outros formatos é permitida, desde que o conteúdo real não seja alterado ou editado de forma alguma. Você não deve publicar ou distribuir esta documentação em qualquer forma ou em qualquer mídia, exceto se você distribuir a documentação de maneira similar à forma como a Oracle a dissemina (ou seja, eletronicamente para download em um Web site com o software) ou em um CD-ROM ou mídia similar, desde que, no entanto, a documentação seja disseminada junto com o software na mesma mídia. Qualquer outro uso, como a disseminação de cópias impressas ou o uso desta documentação, no todo ou em parte, em outra publicação, requer o consentimento prévio por escrito de um representante autorizado da Oracle. A Oracle e/ou suas afiliadas reservam todos e quaisquer direitos a esta documentação não expressamente concedidos acima.

## Acessibilidade da Documentação

Para informações sobre o compromisso da Oracle com a acessibilidade, visite o website do Programa de Acessibilidade da Oracle em <http://www.oracle.com/pls/topic/lookup?ctx=acc&id=docacc>.

## Acesso ao Suporte Oracle para Acessibilidade

Clientes Oracle que compraram suporte têm acesso ao suporte eletrônico através do My Oracle Support. Para informações, visite <http://www.oracle.com/pls/topic/lookup?ctx=acc&id=info> ou visite `http://www.oracle.com/pls/topic/lookup?ctx=acc&id=trs` se você tiver deficiência auditiva.