#### 25.3.2.2 Compilar e instalar o NDB Cluster a partir da fonte no Windows

A Oracle fornece binários pré-compilados do NDB Cluster para Windows, que devem ser adequados para a maioria dos usuários. No entanto, se desejar, também é possível compilar o NDB Cluster para Windows a partir do código-fonte. O procedimento para fazer isso é quase idêntico ao usado para compilar os binários padrão do MySQL Server para Windows, e utiliza as mesmas ferramentas. No entanto, há duas diferenças principais:

- Para construir o MySQL NDB Cluster 8.0, é necessário usar as fontes do MySQL Server 8.0. Elas estão disponíveis na página de downloads do MySQL em <https://dev.mysql.com/downloads/>. O arquivo de fonte arquivado deve ter um nome semelhante a `mysql-8.0.43.tar.gz`. Você também pode obter as fontes no GitHub em <https://github.com/mysql/mysql-server>.

- Você deve configurar a compilação usando a opção `WITH_NDB` além de quaisquer outras opções de compilação que você deseja usar com o **CMake**. `WITH_NDBCLUSTER` também é suportado para compatibilidade reversa, mas é desaconselhado a partir da versão NDB 8.0.31.

Importante

A opção `WITH_NDB_JAVA` está habilitada por padrão. Isso significa que, por padrão, se o **CMake** não conseguir encontrar o local do Java no seu sistema, o processo de configuração falha; se você não deseja habilitar o suporte ao Java e ao ClusterJ, deve indicar isso explicitamente configurando a compilação usando `-DWITH_NDB_JAVA=OFF`. (Bug #12379735) Use `WITH_CLASSPATH` para fornecer o caminho de classe do Java, se necessário.

Para obter mais informações sobre as opções do **CMake** específicas para a construção do NDB Cluster, consulte Opções do CMake para Compilar o NDB Cluster.

Depois que o processo de compilação estiver concluído, você pode criar um arquivo Zip contendo os binários compilados; a Seção 2.8.4, “Instalando o MySQL usando uma distribuição de fonte padrão”, fornece os comandos necessários para realizar essa tarefa em sistemas Windows. Os binários do NDB Cluster podem ser encontrados no diretório `bin` do arquivo resultante, que é equivalente ao arquivo `no-install`, e que pode ser instalado e configurado da mesma maneira. Para mais informações, consulte a Seção 25.3.2.1, “Instalando o NDB Cluster em Windows a partir de uma versão binária”.
