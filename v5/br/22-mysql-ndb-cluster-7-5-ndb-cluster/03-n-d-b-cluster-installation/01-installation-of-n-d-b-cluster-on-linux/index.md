### 21.3.1 Instalação do NDB Cluster no Linux

21.3.1.1 Instalando uma Release Binária do NDB Cluster no Linux

21.3.1.2 Instalando o NDB Cluster a partir de RPM

21.3.1.3 Instalando o NDB Cluster Usando Arquivos .deb

21.3.1.4 Compilando o NDB Cluster a partir do Código Fonte no Linux

Esta seção abrange os métodos de instalação do NDB Cluster no Linux e em outros sistemas operacionais tipo Unix (Unix-like). Embora as próximas seções façam referência a um sistema operacional Linux, as instruções e os procedimentos fornecidos devem ser facilmente adaptáveis a outras plataformas Unix-like suportadas. Para instruções manuais de instalação e setup específicas para sistemas Windows, consulte Section 21.3.2, “Installing NDB Cluster on Windows”.

Cada computador host do NDB Cluster deve ter os programas executáveis corretos instalados. Um host que executa um SQL node deve ter instalado um MySQL Server binary (**mysqld**). Management nodes exigem o management server daemon (**ndb_mgmd**); data nodes exigem o data node daemon (**ndbd** ou **ndbmtd**")). Não é necessário instalar o MySQL Server binary em hosts de management nodes e hosts de data nodes. Recomenda-se que você também instale o management client (**ndb_mgm**) no host do management server.

A instalação do NDB Cluster no Linux pode ser feita usando binaries pré-compilados da Oracle (baixados como um arquivo .tar.gz), com pacotes RPM (também disponíveis na Oracle), ou a partir do código fonte. Todos esses três métodos de instalação são descritos nas seções seguintes.

Independentemente do método utilizado, após a instalação dos binaries do NDB Cluster, ainda é necessário criar configuration files para todos os cluster nodes, antes que o Cluster possa ser iniciado. Consulte Section 21.3.3, “Initial Configuration of NDB Cluster”.