import { Toast } from '~/ui/Toast'

import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { Favorites } from './Favorites'
import { GenreFilter } from './GenreFilter'
import { Header } from './Header'
import { IdleState } from './IdleState'
import { LoadingState } from './LoadingState'
import { usePresenter } from './logic/usePresenter'
import { Pagination } from './Pagination'
import { SearchField } from './SearchField'
import { ShowCard } from './ShowCard'

import styles from './HomePage.module.css'

export function HomePage() {
  const presenter = usePresenter()
  const { view } = presenter

  return (
    <div className={styles.page}>
      <Header>
        <Favorites />
      </Header>
      <main className={styles.main}>
        <SearchField
          query={presenter.query}
          isSearching={presenter.isSearching}
          onQueryChange={presenter.changeQuery}
          onClear={presenter.clearQuery}
        />

        {view === 'idle' && (
          <IdleState
            suggestions={presenter.suggestions}
            onPick={presenter.changeQuery}
          />
        )}
        {view === 'loading' && <LoadingState />}
        {presenter.errorMessage !== null && (
          <ErrorState
            message={presenter.errorMessage}
            onRetry={presenter.retry}
          />
        )}
        {view === 'empty' && <EmptyState query={presenter.searchedFor} />}

        {view === 'results' && (
          <>
            <GenreFilter
              query={presenter.searchedFor}
              resultsLabel={presenter.resultsLabel}
              totalCount={presenter.totalCount}
              genres={presenter.genres}
              selectedGenre={presenter.selectedGenre}
              onSelect={presenter.selectGenre}
              onReset={presenter.resetGenre}
            />
            <section
              className={styles.results}
              aria-label="Search results"
              aria-busy={presenter.isRefreshing}
            >
              <ul className={styles.list}>
                {presenter.visibleShows.map((show) => (
                  <ShowCard key={show.id} show={show} />
                ))}
              </ul>
              <Pagination
                page={presenter.page}
                pageCount={presenter.pageCount}
                rangeLabel={presenter.rangeLabel}
                onChange={presenter.setPage}
              />
            </section>
          </>
        )}
      </main>
      <Toast
        message={presenter.toast?.text ?? null}
        messageId={presenter.toast?.id}
      />
    </div>
  )
}
