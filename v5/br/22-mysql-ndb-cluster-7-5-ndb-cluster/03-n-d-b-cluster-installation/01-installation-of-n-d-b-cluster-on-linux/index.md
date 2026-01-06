### 21.3.1 Instalação do NDB Cluster no Linux

21.3.1.1 Instalação de uma versão binária de um cluster NDB no Linux

21.3.1.2 Instalação do NDB Cluster a partir do RPM

21.3.1.3 Instalação do NDB Cluster usando arquivos .deb

21.3.1.4 Construindo um NDB Cluster a partir do Código-Fonte no Linux

Esta seção abrange os métodos de instalação do NDB Cluster no Linux e em outros sistemas operacionais semelhantes ao Unix. Embora as próximas seções se refiram a um sistema operacional Linux, as instruções e procedimentos fornecidos lá devem ser facilmente adaptáveis a outras plataformas Unix-like suportadas. Para instruções de instalação e configuração manuais específicas para sistemas Windows, consulte Seção 21.3.2, “Instalando o NDB Cluster no Windows”.

Cada computador hospedeiro do NDB Cluster deve ter os programas executáveis corretos instalados. Um hospedeiro que executa um nó SQL deve ter instalado um binário do servidor MySQL (**mysqld**). Os nós de gerenciamento requerem o daemon do servidor de gerenciamento (**ndb\_mgmd**); os nós de dados requerem o daemon do nó de dados (**ndbd** ou **ndbmtd**). Não é necessário instalar o binário do servidor MySQL nos hosts dos nós de gerenciamento e dos nós de dados. Recomenda-se que você também instale o cliente de gerenciamento (**ndb\_mgm**) no host do servidor de gerenciamento.

A instalação do NDB Cluster no Linux pode ser feita usando binários pré-compilados da Oracle (baixados como um arquivo .tar.gz), com pacotes RPM (também disponíveis na Oracle) ou a partir do código-fonte. Todos esses três métodos de instalação são descritos na seção a seguir.

Independentemente do método utilizado, ainda é necessário, após a instalação dos binários do NDB Cluster, criar arquivos de configuração para todos os nós do cluster antes de poder iniciar o cluster. Consulte Seção 21.3.3, “Configuração Inicial do NDB Cluster”.
