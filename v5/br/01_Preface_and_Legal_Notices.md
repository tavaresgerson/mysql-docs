# Prefácio e Avisos Legais

Este é o Manual de Referência para o Sistema de Banco de Dados MySQL, versão 5.7, até a versão 5.7.44. As diferenças entre as versões menores do MySQL 5.7 são mencionadas no presente texto com referência aos números de versão (5.7.*`x`*). Para informações sobre a licença, consulte as Notas Legais.

Este manual não é destinado para uso com versões mais antigas do software MySQL, devido às muitas diferenças funcionais e outras entre o MySQL 5.7 e as versões anteriores. Se você está usando uma versão anterior do software MySQL, consulte o manual apropriado. Por exemplo, o *Manual de Referência do MySQL 5.6* cobre a série de versões do software MySQL 5.6.

Se você está usando o MySQL 8.0, consulte o *Manual de Referência do MySQL 8.0*.

**Informações de licenciamento — MySQL 5.7.** Este produto pode incluir software de terceiros, utilizado sob licença. Se você estiver usando uma versão *Comercial* do MySQL 5.7, consulte o [Manual do Usuário de Informações de Licença de Revisão Comercial do MySQL 5.7](https://downloads.mysql.com/docs/licenses/mysqld-5.7-com-en.pdf) para informações de licenciamento, incluindo informações de licenciamento relacionadas ao software de terceiros que pode ser incluído nesta versão Comercial. Se você estiver usando uma versão *Comunitária* do MySQL 5.7, consulte o [Manual do Usuário de Informações de Licença de Revisão Comunitária do MySQL 5.7](https://downloads.mysql.com/docs/licenses/mysqld-5.7-gpl-en.pdf) para informações de licenciamento, incluindo informações de licenciamento relacionadas ao software de terceiros que pode ser incluído nesta versão Comunitária.

**Informações de licenciamento — MySQL NDB Cluster 7.5.** Este produto pode incluir software de terceiros, utilizado sob licença. Se você estiver usando uma versão *Comercial* do NDB Cluster 7.5, consulte o [Manual do Usuário de Informações de Licença de Versão Comercial do MySQL NDB Cluster 7.5](https://downloads.mysql.com/docs/licenses/cluster-7.5-com-en.pdf) para informações de licenciamento relacionadas ao software de terceiros que pode ser incluído nesta versão Comercial. Se você estiver usando uma versão *Comunitária* do NDB Cluster 7.5, consulte o [Manual do Usuário de Informações de Licença de Versão Comunitária do MySQL NDB Cluster 7.5](https://downloads.mysql.com/docs/licenses/cluster-7.5-gpl-en.pdf) para informações de licenciamento relacionadas ao software de terceiros que pode ser incluído nesta versão Comunitária.

**Informações de licenciamento — MySQL NDB Cluster 7.6.** Se você estiver usando uma versão *comercial* do MySQL NDB Cluster 7.6, consulte o [Manual do usuário de informações de licença da versão comercial do MySQL NDB Cluster 7.6][(https://downloads.mysql.com/docs/licenses/cluster-7.6-com-en.pdf)] para informações de licenciamento, incluindo informações de licenciamento relacionadas a software de terceiros que podem ser incluídos nesta versão comercial. Se você estiver usando uma versão *comunitária* do MySQL NDB Cluster 7.6, consulte o [Manual do usuário de informações de licença da versão comunitária do MySQL NDB Cluster 7.6][(https://downloads.mysql.com/docs/licenses/cluster-7.6-gpl-en.pdf)] para informações de licenciamento, incluindo informações de licenciamento relacionadas a software de terceiros que podem ser incluídos nesta versão comunitária.

## Avisos Legais

Copyright © 1997, 2025, Oracle e/ou suas afiliadas.

**Restrições de Licença**

Este software e a documentação relacionada são fornecidos sob um acordo de licença que contém restrições de uso e divulgação e são protegidos por leis de propriedade intelectual. Exceto conforme expressamente permitido em seu acordo de licença ou permitido por lei, você não pode usar, copiar, reproduzir, traduzir, transmitir, modificar, licenciar, transmitir, distribuir, exibir, executar, publicar ou exibir qualquer parte, em qualquer forma ou por qualquer meio. A engenharia reversa, desmontagem ou descompilação deste software, a menos que exigido por lei para interoperabilidade, é proibida.

**Isenção de garantia**

As informações contidas aqui estão sujeitas a alterações sem aviso prévio e não são garantidas como livres de erros. Se você encontrar algum erro, por favor, informe-nos por escrito.

Aviso sobre direitos restritos

Se este for software, documentação de software, dados (conforme definido no Regulamento Federal de Aquisição) ou documentação relacionada que seja entregue ao Governo dos EUA ou a qualquer pessoa que o licencie em nome do Governo dos EUA, então o seguinte aviso é aplicável: USADOS FINAIS DO GOVERNAMENTO DOS EUA: Os programas da Oracle (incluindo qualquer sistema operacional, software integrado, quaisquer programas incorporados, instalados ou ativados em hardware entregue e modificações desses programas) e a documentação de computador da Oracle ou outros dados da Oracle entregues ou acessados por usuários finais do Governo dos EUA são "software de computador comercial", "documentação de software de computador comercial" ou "dados com direitos limitados" de acordo com o Regulamento Federal de Aquisição aplicável e regulamentos suplementares específicos da agência. Como tal, o uso, reprodução, duplicação, liberação, exibição, divulgação, modificação, preparação de obras derivadas e/ou adaptação de i) programas da Oracle (incluindo qualquer sistema operacional, software integrado, quaisquer programas incorporados, instalados ou ativados em hardware entregue e modificações desses programas), ii) documentação de computador da Oracle e/ou iii) outros dados da Oracle está sujeito aos direitos e limitações especificados na licença contida no contrato aplicável. Os termos que regem o uso dos serviços de nuvem da Oracle pelo Governo dos EUA são definidos pelo contrato aplicável para tais serviços. Nenhum outro direito é concedido ao Governo dos EUA.

Aviso sobre aplicações perigosas

Este software ou hardware é desenvolvido para uso geral em uma variedade de aplicativos de gerenciamento de informações. Não é desenvolvido ou destinado para uso em quaisquer aplicativos inerentemente perigosos, incluindo aplicativos que possam criar risco de lesão pessoal. Se você usar este software ou hardware em aplicativos perigosos, então você será responsável por tomar todas as medidas apropriadas de segurança, backup, redundância e outras medidas para garantir seu uso seguro. A Oracle Corporation e suas afiliadas se desresponsabilizam por quaisquer danos causados pelo uso deste software ou hardware em aplicativos perigosos.

**Aviso de Marcas Registradas**

Oracle, Java, MySQL e NetSuite são marcas registradas da Oracle e/ou de suas afiliadas. Outros nomes podem ser marcas registradas de seus respectivos proprietários.

Intel e Intel Inside são marcas comerciais ou marcas registradas da Intel Corporation. Todas as marcas SPARC são utilizadas sob licença e são marcas comerciais ou marcas registradas da SPARC International, Inc. AMD, Epyc e o logotipo da AMD são marcas comerciais ou marcas registradas da Advanced Micro Devices. UNIX é uma marca registrada do The Open Group.

**Aviso sobre Conteúdo, Produtos e Serviços de Terceiros**

Este software ou hardware e a documentação podem fornecer acesso a conteúdos, produtos e serviços de terceiros ou informações sobre eles. A Oracle Corporation e suas afiliadas não são responsáveis e excluem expressamente todas as garantias de qualquer tipo em relação a conteúdos, produtos e serviços de terceiros, a menos que de outra forma estabelecido em um acordo aplicável entre você e a Oracle. A Oracle Corporation e suas afiliadas não serão responsáveis por qualquer perda, custo ou dano incorrido devido ao seu acesso ou uso de conteúdo, produtos ou serviços de terceiros, exceto conforme estabelecido em um acordo aplicável entre você e a Oracle.

**Uso desta documentação**

Esta documentação NÃO é distribuída sob uma licença GPL. O uso desta documentação está sujeito aos seguintes termos:

Você pode criar uma cópia impressa desta documentação apenas para seu próprio uso pessoal. A conversão para outros formatos é permitida, desde que o conteúdo real não seja alterado ou editado de qualquer forma. Você não deve publicar ou distribuir esta documentação em qualquer forma ou em qualquer meio, exceto se você distribuir a documentação de uma maneira semelhante à forma como a Oracle a dissemina (ou seja, eletronicamente para download em um site com o software) ou em um CD-ROM ou meio semelhante, desde que, no entanto, a documentação seja disseminada juntamente com o software no mesmo meio. Qualquer outro uso, como qualquer disseminação de cópias impressas ou uso desta documentação, no todo ou em parte, em outra publicação, requer o consentimento prévio por escrito de um representante autorizado da Oracle. A Oracle e/ou suas afiliadas reservam todos os direitos desta documentação que não foram expressamente concedidos acima.

## Acessibilidade da documentação
Para informações sobre o compromisso da Oracle com a acessibilidade, visite o site do Programa de Acessibilidade da Oracle em <http://www.oracle.com/pls/topic/lookup?ctx=acc&id=docacc>.

## Acesso ao Suporte da Oracle para Acessibilidade
Os clientes da Oracle que adquiriram suporte têm acesso ao suporte eletrônico através do My Oracle Support. Para informações, visite <http://www.oracle.com/pls/topic/lookup?ctx=acc&id=info> ou visite `http://www.oracle.com/pls/topic/lookup?ctx=acc&id=trs` se você tiver deficiência auditiva.