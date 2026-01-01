# Prefácio e Avisos Legais

Este é o Manual de Referência para o Sistema de Banco de Dados MySQL, versão 5.7, até a versão 5.7.44. As diferenças entre as versões menores do MySQL 5.7 são mencionadas neste texto com referência aos números de versão (5.7.*\`x*). Para informações sobre a licença, consulte as Notas Legais.

Este manual não é destinado para uso com versões mais antigas do software MySQL, devido às muitas diferenças funcionais e outras entre o MySQL 5.7 e as versões anteriores. Se você estiver usando uma versão anterior do software MySQL, consulte o manual apropriado. Por exemplo, o *Manual de Referência do MySQL 5.6* cobre as versões da série 5.6 do software MySQL.

Se você estiver usando o MySQL 8.0, consulte o *Manual de Referência do MySQL 8.0*.

**Informações de licenciamento — MySQL 5.7.** Este produto pode incluir software de terceiros, utilizado sob licença. Se você estiver usando uma versão *Comercial* do MySQL 5.7, consulte o Manual do Usuário de Informações de Licença de Versão Comercial do MySQL 5.7 para obter informações sobre a licença, incluindo informações sobre software de terceiros que podem estar incluídos nesta versão Comercial. Se você estiver usando uma versão *Comunitária* do MySQL 5.7, consulte o Manual do Usuário de Informações de Licença de Versão Comunitária do MySQL 5.7 para obter informações sobre a licença, incluindo informações sobre software de terceiros que podem estar incluídos nesta versão Comunitária.

**Informações de licenciamento — MySQL NDB Cluster 7.5.** Este produto pode incluir software de terceiros, utilizado sob licença. Se você estiver usando uma versão *Comercial* do NDB Cluster 7.5, consulte o Manual do Usuário de Informações de Licença da Versão Comercial do MySQL NDB Cluster 7.5 para informações de licenciamento relacionadas ao software de terceiros que possa estar incluído nesta versão Comercial. Se você estiver usando uma versão *Comunitária* do NDB Cluster 7.5, consulte o Manual do Usuário de Informações de Licença da Versão Comunitária do MySQL NDB Cluster 7.5 para informações de licenciamento relacionadas ao software de terceiros que possa estar incluído nesta versão Comunitária.

**Informações de licenciamento — MySQL NDB Cluster 7.6.** Se você estiver usando uma versão *Comercial* do MySQL NDB Cluster 7.6, consulte o Manual do Usuário de Informações de Licença da Versão Comercial do MySQL NDB Cluster 7.6 para obter informações sobre a licença, incluindo informações sobre software de terceiros que possam estar incluídos nesta versão Comercial. Se você estiver usando uma versão *Comunitária* do MySQL NDB Cluster 7.6, consulte o Manual do Usuário de Informações de Licença da Versão Comunitária do MySQL NDB Cluster 7.6 para obter informações sobre a licença, incluindo informações sobre software de terceiros que possam estar incluídos nesta versão Comunitária.

## Avisos Legais

Copyright © 1997, 2025, Oracle e/ou suas afiliadas.

**Restrições de Licença**

Este software e a documentação relacionada são fornecidos sob um contrato de licença que contém restrições de uso e divulgação e são protegidos por leis de propriedade intelectual. Exceto conforme expressamente permitido no seu contrato de licença ou permitido por lei, você não pode usar, copiar, reproduzir, traduzir, transmitir, modificar, licenciar, transmitir, distribuir, exibir, executar, publicar ou exibir qualquer parte, em qualquer forma ou por qualquer meio. A engenharia reversa, desmontagem ou descompilação deste software, a menos que exigido por lei para a interoperabilidade, é proibida.

**Isenção de Garantia**

As informações contidas aqui estão sujeitas a alterações sem aviso prévio e não são garantidas como livres de erros. Se você encontrar algum erro, por favor, nos informe por escrito.

**Aviso sobre direitos restritos**

Se este for software, documentação de software, dados (conforme definido no Regulamento Federal de Aquisição) ou documentação relacionada que seja entregue ao Governo dos EUA ou a qualquer pessoa que o licencie em nome do Governo dos EUA, então o seguinte aviso se aplica:

USUÁRIOS FINAIS DO GOVERNO DOS EUA: Os programas da Oracle (incluindo qualquer sistema operacional, software integrado, quaisquer programas incorporados, instalados ou ativados no hardware entregue, e as modificações desses programas) e a documentação de computadores da Oracle ou outros dados da Oracle entregues ou acessados por usuários finais do governo dos EUA são considerados "software de computador comercial", "documentação de software de computador comercial" ou "dados com direitos limitados" de acordo com o Regulamento Federal de Aquisição aplicável e as regulamentações complementares específicas da agência. Como tal, o uso, reprodução, duplicação, liberação, exibição, divulgação, modificação, preparação de obras derivadas e/ou adaptação de i) os programas da Oracle (incluindo qualquer sistema operacional, software integrado, quaisquer programas incorporados, instalados ou ativados no hardware entregue, e as modificações desses programas), ii) a documentação de computadores da Oracle e/ou iii) outros dados da Oracle estão sujeitos aos direitos e limitações especificados na licença contida no contrato aplicável. Os termos que regem o uso dos serviços da nuvem da Oracle pelo governo dos EUA são definidos pelo contrato aplicável para esses serviços. Nenhum outro direito é concedido ao governo dos EUA.

**Aviso sobre Aplicativos Perigosos**

Este software ou hardware é desenvolvido para uso geral em uma variedade de aplicações de gerenciamento de informações. Ele não é desenvolvido ou destinado para uso em aplicações inerentemente perigosas, incluindo aplicações que possam criar risco de lesão pessoal. Se você usar este software ou hardware em aplicações perigosas, você será responsável por tomar todas as medidas de segurança, backup, redundância e outras medidas apropriadas para garantir seu uso seguro. A Oracle Corporation e suas afiliadas declinam qualquer responsabilidade por quaisquer danos causados pelo uso deste software ou hardware em aplicações perigosas.

**Aviso de Marca Registrada**

Oracle, Java, MySQL e NetSuite são marcas registradas da Oracle e/ou de suas afiliadas. Outros nomes podem ser marcas registradas de seus respectivos proprietários.

Intel e Intel Inside são marcas registradas ou marcas registradas da Intel Corporation. Todas as marcas SPARC são usadas sob licença e são marcas registradas ou marcas registradas da SPARC International, Inc. AMD, Epyc e o logotipo da AMD são marcas registradas ou marcas registradas da Advanced Micro Devices. UNIX é uma marca registrada da The Open Group.

**Aviso sobre Conteúdo, Produtos e Serviços de Terceiros**

Este software ou hardware e a documentação podem fornecer acesso a conteúdos, produtos e serviços de terceiros ou informações sobre eles. A Oracle Corporation e suas afiliadas não são responsáveis por quaisquer garantias de qualquer tipo em relação a conteúdos, produtos e serviços de terceiros, a menos que de outra forma estabelecido em um acordo aplicável entre você e a Oracle. A Oracle Corporation e suas afiliadas não serão responsáveis por qualquer perda, custo ou dano incorrido devido ao seu acesso ou uso de conteúdos, produtos ou serviços de terceiros, exceto conforme estabelecido em um acordo aplicável entre você e a Oracle.

**Uso desta documentação**

Esta documentação NÃO é distribuída sob uma licença GPL. O uso desta documentação está sujeito aos seguintes termos:

Você pode criar uma cópia impressa desta documentação apenas para uso pessoal. A conversão para outros formatos é permitida desde que o conteúdo real não seja alterado ou editado de qualquer forma. Você não deve publicar ou distribuir esta documentação em qualquer forma ou em qualquer mídia, exceto se você distribuir a documentação de maneira semelhante à forma como a Oracle a dissemina (ou seja, eletronicamente para download em um site com o software) ou em um CD-ROM ou meio semelhante, desde que a documentação seja disseminada juntamente com o software no mesmo meio. Qualquer outro uso, como qualquer disseminação de cópias impressas ou uso desta documentação, no todo ou em parte, em outra publicação, requer o consentimento prévio por escrito de um representante autorizado da Oracle. A Oracle e/ou suas afiliadas reservam todos os direitos desta documentação que não foram expressamente concedidos acima.

## Acessibilidade da documentação

Para obter informações sobre o compromisso da Oracle com a acessibilidade, visite o site do Programa de Acessibilidade da Oracle em <http://www.oracle.com/pls/topic/lookup?ctx=acc&id=docacc>.

## Acesso ao Suporte da Oracle para Acessibilidade

Os clientes da Oracle que adquiriram suporte têm acesso ao suporte eletrônico através do Meu Suporte Oracle. Para obter informações, visite <http://www.oracle.com/pls/topic/lookup?ctx=acc&id=info> ou visite `http://www.oracle.com/pls/topic/lookup?ctx=acc&id=trs` se você tiver deficiência auditiva.
