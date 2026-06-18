### 2.1.2 Qual versão e distribuição do MySQL para instalar

Ao preparar a instalação do MySQL, decida qual versão e formato de distribuição (binário ou fonte) utilizar.

Primeiro, decida se deseja instalar uma versão de desenvolvimento ou uma versão de disponibilidade geral (GA). As versões de desenvolvimento têm as funcionalidades mais recentes, mas não são recomendadas para uso em produção. As versões de disponibilidade geral, também chamadas de versões de produção ou estáveis, são destinadas ao uso em produção. Recomendamos o uso da versão mais recente de GA.

O esquema de nomeação no MySQL 5.7 utiliza nomes de versão que consistem em três números e um sufixo opcional; por exemplo, **mysql-5.7.1-m1**. Os números dentro do nome da versão são interpretados da seguinte forma:

- O primeiro número (**5**) é o número da versão principal.

- O segundo número (**7**) é o número da versão menor. Juntos, os números principal e menor constituem o número da série de lançamento. O número da série descreve o conjunto de recursos estáveis.

- O terceiro número (**1**) é o número da versão dentro da série de lançamentos. Ele é incrementado para cada nova versão de correção de bugs. Na maioria dos casos, a versão mais recente dentro de uma série é a melhor escolha.

Os nomes das versões também podem incluir um sufixo para indicar o nível de estabilidade da versão. As versões dentro de uma série avançam através de um conjunto de sufixos para indicar como o nível de estabilidade melhora. Os sufixos possíveis são:

- **m*N*** (por exemplo, **m1**, **m2**, **m3**, ...) indica um número de marco. O desenvolvimento do MySQL utiliza um modelo de marco, no qual cada marco introduz um pequeno subconjunto de funcionalidades testadas minuciosamente. De um marco para o próximo, as interfaces das funcionalidades podem mudar ou até mesmo as funcionalidades podem ser removidas, com base no feedback fornecido pelos membros da comunidade que experimentam essas versões iniciais. As funcionalidades dentro dos lançamentos de marcos podem ser consideradas de qualidade de pré-produção.

- **rc** indica um candidato a lançamento (RC). Acredita-se que os candidatos a lançamento sejam estáveis, tendo passado por todos os testes internos do MySQL. Novos recursos ainda podem ser introduzidos em lançamentos RC, mas o foco muda para corrigir bugs para estabilizar os recursos introduzidos anteriormente na série.

- A ausência de um sufixo indica uma disponibilidade geral (GA) ou lançamento de produção. As versões GA são estáveis, tendo passado com sucesso pelas etapas de lançamento anteriores, e acredita-se que sejam confiáveis, livres de erros graves e adequadas para uso em sistemas de produção.

O desenvolvimento de uma série começa com lançamentos de marcos, seguidos por lançamentos RC e, finalmente, atinge lançamentos de status GA.

Depois de escolher a versão do MySQL a ser instalada, decida qual formato de distribuição instalar para o seu sistema operacional. Para a maioria dos casos de uso, uma distribuição binária é a escolha certa. Distribuições binárias estão disponíveis no formato nativo para muitas plataformas, como pacotes RPM para Linux ou pacotes DMG para macOS. As distribuições também estão disponíveis em formatos mais genéricos, como arquivos Zip ou arquivos **tar** comprimidos. No Windows, você pode usar o Instalador do MySQL para instalar uma distribuição binária.

Em algumas circunstâncias, pode ser preferível instalar o MySQL a partir de uma distribuição de fonte:

- Você deseja instalar o MySQL em um local específico. As distribuições binárias padrão estão prontas para serem executadas em qualquer local de instalação, mas você pode precisar de ainda mais flexibilidade para colocar os componentes do MySQL onde desejar.

- Você deseja configurar o **mysqld** com recursos que podem não estar incluídos nas distribuições binárias padrão. Aqui está uma lista das opções extras mais comuns usadas para garantir a disponibilidade dos recursos:

  - `-DWITH_LIBWRAP=1` para suporte a wrappers TCP.

  - `-DWITH_ZLIB={system|bundled}` para recursos que dependem da compressão

  - `-DWITH_DEBUG=1` para suporte de depuração

  Para obter informações adicionais, consulte a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

- Você deseja configurar o **mysqld** sem alguns recursos incluídos nas distribuições binárias padrão. Por exemplo, as distribuições são normalmente compiladas com suporte para todos os conjuntos de caracteres. Se você deseja um servidor MySQL menor, pode recompilar com suporte apenas para os conjuntos de caracteres que você precisa.

- Você deseja ler ou modificar o código C e C++ que compõe o MySQL. Para isso, obtenha uma distribuição de código-fonte.

- As distribuições de fonte contêm mais testes e exemplos do que as distribuições binárias.
