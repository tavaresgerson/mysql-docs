### 2.1.2 Qual Versão e Distribuição do MySQL Instalar

Ao se preparar para instalar o MySQL, decida qual versão e formato de distribuição (binary ou source) usar.

Primeiro, decida se irá instalar um *release* de desenvolvimento ou um *release* General Availability (GA). *Releases* de desenvolvimento possuem as funcionalidades mais recentes, mas não são recomendados para uso em produção. *Releases* GA, também chamados de *releases* de produção ou estáveis, são destinados ao uso em produção. Recomendamos usar o *release* GA mais recente.

O esquema de nomenclatura no MySQL 5.7 usa nomes de *release* que consistem em três números e um sufixo opcional; por exemplo, **mysql-5.7.1-m1**. Os números dentro do nome do *release* são interpretados da seguinte forma:

* O primeiro número (**5**) é o número da versão major (principal).

* O segundo número (**7**) é o número da versão minor (secundária). Juntos, os números major e minor constituem o número da série do *release*. O número da série descreve o conjunto estável de funcionalidades (*feature set*).

* O terceiro número (**1**) é o número da versão dentro da série do *release*. Este é incrementado para cada novo *release* de correção de *bugs* (*bugfix*). Na maioria dos casos, a versão mais recente dentro de uma série é a melhor escolha.

Nomes de *release* também podem incluir um sufixo para indicar o nível de estabilidade do *release*. *Releases* dentro de uma série progridem através de um conjunto de sufixos para indicar como o nível de estabilidade melhora. Os sufixos possíveis são:

* **m*N*** (por exemplo, **m1**, **m2**, **m3**, ...) indica um número de *milestone* (marco). O desenvolvimento do MySQL usa um modelo de *milestone*, no qual cada *milestone* introduz um pequeno subconjunto de funcionalidades completamente testadas. De um *milestone* para o próximo, as interfaces de funcionalidade (*feature interfaces*) podem mudar ou as funcionalidades podem até ser removidas, com base no *feedback* fornecido pelos membros da comunidade que experimentam estes *releases* iniciais. As funcionalidades dentro dos *releases milestone* podem ser consideradas de qualidade de pré-produção.

* **rc** indica um Release Candidate (RC). Acredita-se que os *Release Candidates* sejam estáveis, tendo passado por todos os testes internos do MySQL. Novas funcionalidades ainda podem ser introduzidas nos *releases* RC, mas o foco muda para a correção de *bugs* para estabilizar funcionalidades introduzidas anteriormente na série.

* A ausência de um sufixo indica um *release* General Availability (GA) ou de Produção. *Releases* GA são estáveis, tendo passado com sucesso pelos estágios de *release* anteriores, e são considerados confiáveis, livres de *bugs* sérios e adequados para uso em sistemas de produção.

O desenvolvimento dentro de uma série começa com *releases milestone*, seguidos por *releases* RC e, finalmente, atinge os *releases* com status GA.

Após escolher qual versão do MySQL instalar, decida qual formato de distribuição instalar para o seu sistema operacional. Para a maioria dos casos de uso, uma distribuição *binary* é a escolha certa. Distribuições *binary* estão disponíveis em formato nativo para muitas plataformas, como pacotes RPM para Linux ou pacotes DMG para macOS. As distribuições também estão disponíveis em formatos mais genéricos, como arquivos Zip ou arquivos **tar** compactados. No Windows, você pode usar o MySQL Installer para instalar uma distribuição *binary*.

Em algumas circunstâncias, pode ser preferível instalar o MySQL a partir de uma distribuição *source*:

* Você deseja instalar o MySQL em algum local explícito. As distribuições *binary* padrão estão prontas para rodar em qualquer local de instalação, mas você pode exigir ainda mais flexibilidade para posicionar os componentes do MySQL onde desejar.

* Você deseja configurar o **mysqld** com funcionalidades (*features*) que podem não estar incluídas nas distribuições *binary* padrão. Aqui está uma lista das opções extras mais comuns usadas para garantir a disponibilidade de funcionalidades:

  + `-DWITH_LIBWRAP=1` para suporte a TCP wrappers.

  + `-DWITH_ZLIB={system|bundled}` para funcionalidades que dependem de compressão

  + `-DWITH_DEBUG=1` para suporte a *debugging*

  Para informações adicionais, consulte a Seção 2.8.7, “MySQL Source-Configuration Options”.

* Você deseja configurar o **mysqld** sem algumas funcionalidades que estão incluídas nas distribuições *binary* padrão. Por exemplo, as distribuições são normalmente compiladas com suporte para todos os *character sets*. Se você quiser um MySQL server menor, você pode recompilá-lo com suporte apenas para os *character sets* de que precisa.

* Você deseja ler ou modificar o código C e C++ que compõe o MySQL. Para este propósito, obtenha uma distribuição *source*.

* Distribuições *source* contêm mais testes e exemplos do que distribuições *binary*.