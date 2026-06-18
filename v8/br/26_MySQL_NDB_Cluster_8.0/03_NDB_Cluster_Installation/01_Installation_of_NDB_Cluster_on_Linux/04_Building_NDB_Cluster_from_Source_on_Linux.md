#### 25.3.1.4 Construindo um cluster NDB Cluster a partir do código-fonte no Linux

Esta seção fornece informações sobre a compilação do NDB Cluster no Linux e em outras plataformas Unix-like. A construção do NDB Cluster a partir do código-fonte é semelhante à construção do servidor MySQL padrão, embora difira em alguns aspectos-chave discutidos aqui. Para informações gerais sobre a construção do MySQL a partir do código-fonte, consulte a Seção 2.8, “Instalando o MySQL a partir do código-fonte”. Para informações sobre a compilação do NDB Cluster em plataformas Windows, consulte a Seção 25.3.2.2, “Compilação e instalação do NDB Cluster a partir do código-fonte em Windows”.

Para construir o MySQL NDB Cluster 8.0, é necessário usar as fontes do MySQL Server 8.0. Elas estão disponíveis na página de downloads do MySQL em <https://dev.mysql.com/downloads/>. O arquivo de fonte arquivado deve ter um nome semelhante a `mysql-8.0.43.tar.gz`. Você também pode obter as fontes no GitHub em <https://github.com/mysql/mysql-server>.

Nota

Em versões anteriores, a construção do NDB Cluster a partir de fontes padrão do MySQL Server não era suportada. No MySQL 8.0 e no NDB Cluster 8.0, isso já não é mais o caso — *ambos os produtos agora são construídos a partir das mesmas fontes*.

A opção `WITH_NDB` para o **CMake** faz com que os binários para os nós de gerenciamento, nós de dados e outros programas do NDB Cluster sejam compilados; também faz com que o **mysqld** seja compilado com suporte ao mecanismo de armazenamento `NDB`. Esta opção (ou, antes do NDB 8.0.31, `WITH_NDBCLUSTER`) é necessária ao construir o NDB Cluster.

Importante

A opção `WITH_NDB_JAVA` está habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar a localização do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, deve indicar isso explicitamente configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para obter mais informações sobre as opções do **CMake** específicas para a construção do NDB Cluster, consulte Opções do CMake para Compilar o NDB Cluster.

Depois de executar **make && make install** (ou o equivalente do seu sistema), o resultado é semelhante ao obtido ao descompilar um binário pré-compilado para a mesma localização.

**Nodos de gerenciamento.** Ao compilar a partir da fonte e executar o **make install** padrão, os binários do servidor de gerenciamento e do cliente de gerenciamento (**ndb\_mgmd** e **ndb\_mgm**) podem ser encontrados em `/usr/local/mysql/bin`. Apenas o **ndb\_mgmd** é necessário estar presente em um host de nó de gerenciamento; no entanto, também é uma boa ideia ter o **ndb\_mgm** presente na mesma máquina do host. Nenhum desses executáveis requer uma localização específica no sistema de arquivos da máquina do host.

**Nodos de dados.** O único executável necessário em um host de nó de dados é o binário **ndbd** ou **ndbmtd** do nó de dados (**mysqld**, por exemplo, não precisa estar presente na máquina do host). Por padrão, ao compilar a partir do código-fonte, este arquivo é colocado no diretório `/usr/local/mysql/bin`. Para a instalação em vários hosts de nó de dados, apenas **ndbd** ou **ndbmtd**") precisa ser copiado para a(s) máquina(s) do host. (Isso pressupõe que todos os hosts de nó de dados usem a mesma arquitetura e sistema operacional; caso contrário, você pode precisar compilar separadamente para cada plataforma diferente.) O binário do nó de dados não precisa estar em um local específico no sistema de arquivos do host, desde que o local seja conhecido.

Ao compilar o NDB Cluster a partir da fonte, não são necessárias opções especiais para a construção de binários de nós de dados multithread. Configurar a compilação com suporte ao motor de armazenamento `NDB` faz com que o **ndbmtd")** seja construído automaticamente; o **make install** coloca o binário **ndbmtd")** no diretório de instalação `bin` junto com **mysqld**, **ndbd** e **ndb\_mgm**.

**Nodos SQL.** Se você compilar o MySQL com suporte a clustering e realizar a instalação padrão (usando o usuário `root` `/usr/local/mysql/bin` para o sistema), o **mysqld** é colocado em `/usr/local/mysql/bin`. Siga os passos descritos na Seção 2.8, “Instalando o MySQL a partir da fonte”, para preparar o **mysqld** para uso. Se você deseja executar vários nós SQL, pode usar uma cópia do mesmo executável **mysqld** e seus arquivos de suporte associados em várias máquinas. A maneira mais fácil de fazer isso é copiar todo o diretório `/usr/local/mysql` e todos os diretórios e arquivos contidos nele para o(s) host(s) do outro nó SQL, e então repetir os passos da Seção 2.8, “Instalando o MySQL a partir da fonte”, em cada máquina. Se você configurar a compilação com uma opção não padrão `PREFIX`, você deve ajustar o diretório conforme necessário.

Na Seção 25.3.3, “Configuração Inicial do NDB Cluster”, criamos arquivos de configuração para todos os nós do nosso exemplo de NDB Cluster.
